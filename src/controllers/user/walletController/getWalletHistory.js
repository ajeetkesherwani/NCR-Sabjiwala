const WalletHistory = require("../../../models/walletHistory");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getWalletHistory = catchAsync(async (req, res) => {

    const userId = req.user._id;

    try {

        const walletHistory = await WalletHistory.find({});
        if (!walletHistory) throw new AppError("walletHistory not found", 404);

        return res.status("200").json({
            success: true,
            message: "walletHistory found",
            data: {
                userid: userId,
                walletHistory
            }
        })

    } catch (error) {
        return res.status("500").json({ success: false, message: error.message });
    }

});