const Vendor = require("../../../models/vendor");
const Shop = require("../../../models/shop"); // Import the Shop model
const WalletHistory = require("../../../models/walletHistory");

exports.settleVendorWallet = async (req, res) => {
    try {
        const { amount, remark } = req.body;
        const vendorId = req.params.vendorId;

        // Basic validation
        if (!vendorId || !amount || isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({
                status: false,
                message: "Invalid vendor ID or amount"
            });
        }

        const numericAmount = Number(amount);

        // Find vendor
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({
                status: false,
                message: "Vendor not found"
            });
        }

        if (vendor.wallet_balance < numericAmount) {
            return res.status(400).json({
                status: false,
                message: "Insufficient balance in vendor wallet"
            });
        }

        // Deduct the amount from the vendor's wallet
        vendor.wallet_balance -= numericAmount;
        await vendor.save();

        // Reset wallet balances of all associated shops to zero
        await Shop.updateMany(
            { vendorId: vendor._id },
            { $set: { wallet_balance: 0 } }
        );

        // Record in wallet history
        await WalletHistory.create({
            vendorId: vendor._id,
            action: 'settlement',
            amount: numericAmount,
            balance_after_action: vendor.wallet_balance,
            description: remark || 'Wallet settlement by admin',
        });

        return res.status(200).json({
            status: true,
            message: "Wallet settled successfully and all associated shop wallets reset to zero",
            wallet_balance: vendor.wallet_balance
        });

    } catch (error) {
        console.error("Error settling vendor wallet:", error);
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
};
