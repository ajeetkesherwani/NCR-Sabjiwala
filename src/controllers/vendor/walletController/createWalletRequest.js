const Vendor = require("../../../models/vendor");
const WalletRequest = require("../../../models/walletRequest");
const catchAsync = require("../../../utils/catchAsync");

exports.createWalletRequest = catchAsync(async (req, res, next) => {
    try {

        let { amount_requested, message } = req.body
        const vendorId = req.vendor._id;

        if (!amount_requested || amount_requested <= 0) {
            return res.status(400).json({ message: "Invalid withdrawal amount", status: "notsuccess" });
        }

        // Check vendor exists
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found", status: "notsuccess" });
        }

        if (vendor.wallet_balance < amount_requested) {
            return res.status(400).json({ message: "Insufficient wallet balance", status: "notsuccess" });
        }

        const walletRequest = await WalletRequest.create({
            vendorId,
            amount_requested,
            message,
            status: "pending",
            admin_settled: false
        });

        return res.status(201).json({
            message: "Withdrawal request submitted successfully",
            status: "success",
            data: walletRequest
        });


    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong", status: "notsuccess", error: error.message });
    }
})