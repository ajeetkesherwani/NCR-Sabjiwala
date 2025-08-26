const WalletRequest = require("../../../models/walletRequest");
const catchAsync = require("../../../utils/catchAsync");

exports.getWalletRequest = catchAsync(async (req, res, next) => {
    try {
        // Use driver's ID from the request object
        const driverId = req.driver._id;

        // Fetch wallet requests for the driver and sort by request_date in descending order
        const walletRequests = await WalletRequest.find({ driverId }).sort({ request_date: -1 });

        return res.status(200).json({
            message: "Driver wallet requests",
            status: "success",
            wallet_requests: walletRequests
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong",
            status: "notsuccess",
            error: error.message
        });
    }
});
