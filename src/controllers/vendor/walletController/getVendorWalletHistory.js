const WalletHistory = require("../../../models/walletHistory");
const catchAsync = require("../../../utils/catchAsync");

exports.getVendorWalletHistory = catchAsync(async (req, res, next) => {
    try {
        const vendorId = req.vendor.id;

        const history = await WalletHistory.find({ vendorId }).sort({ createdAt: -1 }).lean();

        return res.status(200).json({
            status: "success",
            message: "Vendor wallet history fetched successfully.",
            data: history,
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
