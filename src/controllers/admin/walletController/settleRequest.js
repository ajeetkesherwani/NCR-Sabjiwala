const Vendor = require("../../../models/vendor");
const Driver = require("../../../models/driver");
const WalletHistory = require("../../../models/walletHistory");
const WalletRequest = require("../../../models/walletRequest");
const catchAsync = require("../../../utils/catchAsync");

exports.settleRequest = catchAsync(async (req, res, next) => {
    try {
        const id = req.params.requestId;
        const { amount, type } = req.body;

        const walletRequest = await WalletRequest.findById(id);
        if (!walletRequest) {
            return res.status(404).json({ message: "Wallet request not found", status: "notsuccess" });
        }

        let user = null;
        if (type === "vendor") {
            user = await Vendor.findById(walletRequest.vendorId);
            if (!user) return res.status(404).json({ message: "Vendor not found", status: "notsuccess" });
        } else if (type === "driver") {
            user = await Driver.findById(walletRequest.driverId);
            if (!user) return res.status(404).json({ message: "Driver not found", status: "notsuccess" });
        } else {
            return res.status(400).json({ message: "Invalid type", status: "notsuccess" });
        }

        if (user.wallet_balance < amount) {
            return res.status(400).json({ message: "Insufficient wallet balance", status: "notsuccess" });
        }

        // Deduct wallet balance
        user.wallet_balance -= amount;
        await user.save();

        // Mark request as settled
        walletRequest.admin_settled = true;
        await walletRequest.save();

        // Save wallet history
        const walletHistory = new WalletHistory({
            [`${type}Id`]: user._id, // either vendorId or driverId
            action: "settlement",
            amount: amount,
            balance_after_action: user.wallet_balance,
            description: `Wallet request settled by admin.`,
        });
        await walletHistory.save();

        return res.status(200).json({
            message: "Wallet request settled successfully",
            status: "success",
            data: walletRequest,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong",
            status: "notsuccess",
            error: error.message,
        });
    }
});
