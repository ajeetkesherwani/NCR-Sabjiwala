const Driver = require("../../../models/driver");
const newOrder = require("../../../models/newOrder");
const User = require("../../../models/user");
const WalletHistory = require("../../../models/walletHistory");


exports.settleUserWallet = async (req, res) => {
    try {
        const { amount, remark, type, orderId } = req.body;
        const userId = req.params.userId;

        // Basic validation
        if (!userId || !amount || isNaN(amount) || Number(amount) <= 0 || !['credit', 'debit'].includes(type)) {
            return res.status(400).json({
                status: false,
                message: "Invalid input: userId, amount or type is missing/invalid"
            });
        }

        const order = await newOrder.findById(orderId);
        if (!order) {
            return res.status(404).json({
                status: false,
                message: "Order not found"
            });
        }

        const numericAmount = Number(amount);

        // Find driver
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        if (type === 'credit') {
            user.wallet += numericAmount;
            if (orderId) {
                order.isRefunded = true;
                await order.save();
            }
        } else if (type === 'debit') {
            if (user.wallet < numericAmount) {
                return res.status(400).json({
                    status: false,
                    message: "Insufficient wallet balance"
                });
            }
            user.wallet -= numericAmount;
        } else {
            return res.status(400).json({ status: false, message: "Invalid type, must be 'credit' or 'debit'" });
        }

        await user.save();

        // Record in WalletHistory
        await WalletHistory.create({
            userId: user._id,
            action: type,
            amount: numericAmount,
            balance_after_action: user.wallet,
            description: remark || `${type} ${numericAmount} by goRabit`,
        });

        return res.status(200).json({
            status: true,
            message: `${type} ${numericAmount} by goRabit`,
            wallet_balance: user.wallet
        });

    } catch (error) {
        console.error("Error settling user wallet:", error);
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
};
