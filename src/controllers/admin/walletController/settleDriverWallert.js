const Driver = require("../../../models/driver");
const WalletHistory = require("../../../models/walletHistory");


exports.settleDriverWallet = async (req, res) => {
    try {
        const { amount, remark, type } = req.body;
        const driverId = req.params.driverId;

        // Basic validation
        if (!driverId || !amount || isNaN(amount) || Number(amount) <= 0 || !['wallet', 'cash'].includes(type)) {
            return res.status(400).json({
                status: false,
                message: "Invalid input: driverId, amount or type is missing/invalid"
            });
        }

        const numericAmount = Number(amount);

        // Find driver
        const driver = await Driver.findById(driverId);
        if (!driver) {
            return res.status(404).json({
                status: false,
                message: "Driver not found"
            });
        }

        // Determine balance field
        let balanceField = type === 'wallet' ? 'wallet_balance' : 'cashCollection';
        if (driver[balanceField] < numericAmount) {
            return res.status(400).json({
                status: false,
                message: `Insufficient ${type === 'wallet' ? 'wallet balance' : 'cash collection amount'}`
            });
        }

        // Deduct amount
        driver[balanceField] -= numericAmount;
        await driver.save();

        // Record in WalletHistory
        await WalletHistory.create({
            driverId: driver._id,
            action: 'settlement',
            amount: numericAmount,
            balance_after_action: driver[balanceField],
            description: remark || `Driver ${type} settlement by admin`,
        });

        return res.status(200).json({
            status: true,
            message: `${type === 'wallet' ? 'Wallet' : 'Cash'} settled successfully`,
            wallet_balance: driver.wallet_balance,
            cashCollection: driver.cashCollection
        });

    } catch (error) {
        console.error("Error settling driver balance:", error);
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
};
