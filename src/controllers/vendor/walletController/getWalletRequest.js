const WalletRequest = require("../../../models/walletRequest");
const catchAsync = require("../../../utils/catchAsync");

exports.getWalletRequest = catchAsync(async (req, res, next) => {
    try {

        const vendorId = req.vendor._id;

        const wallet_request = await WalletRequest.find({ vendorId }).sort({ request_date: -1 });

        return res.status(201).json({ message: "Vendor wallet request", status: "success", wallet_request });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong", status: "notsuccess", error: error.message });
    }
})