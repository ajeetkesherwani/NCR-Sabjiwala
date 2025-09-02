const WalletHistory = require("../../../models/walletHistory");
const User = require("../../../models/user");
const catchAsync = require("../../../utils/catchAsync");

exports.createWalletHistory = catchAsync(async (req, res) => {
    try {

        const userId = req.user._id;

        const { amount, action, razorpay_id, description, balance_after_action } = req.body;

        const amountNum = Number(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            return res.status(400).json({ success: false, message: "Invalid amount" });
        }

        if (action !== "credit" && action !== "debit") {
            return res.status(400).json({ success: false, message: "Invalid wallet action" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let newBalance = user.wallet_balance;

        if (action === "credit") {
            newBalance += amount;
        } else {
            if (user.wallet_balance < amount) {
                return res.status(400).json({ success: false, message: "Insufficient wallet balance" });
            }
            newBalance -= amount;
        }

        const newWalletHistory = await WalletHistory.create({
            userId: req.user.id,
            amount,
            action,
            razorpay_id,
            description,
            balance_after_action: newBalance
        });

        user.wallet_balance = newBalance
         await user.save();


        return res.status(201).json({
            success: true,
            message: `Wallet ${action} successful`,
            data: {
                newWalletHistory
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});