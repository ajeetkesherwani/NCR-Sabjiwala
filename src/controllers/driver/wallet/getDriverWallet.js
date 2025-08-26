const Driver = require("../../../models/driver");
const WalletHistory = require("../../../models/walletHistory");
const WalletRequest = require("../../../models/walletRequest");
const catchAsync = require("../../../utils/catchAsync");

exports.getDriverWallet = catchAsync(async (req, res, next) => {
    try {
        let driverId = req.driver._id;

        // Fetch the driver
        const driver = await Driver.findById(driverId);

        // Fetch the wallet history for the driver
        const walletHistory = await WalletHistory.find({ driverId: driverId }).sort({ createdAt: -1 });

        const walletRequests = await WalletRequest.find({ driverId }).sort({ request_date: -1 });

        // calculate the balance and cash collection
        const walletBalance = driver.wallet_balance;
        const cashCollection = driver.cashCollection;

        return res.status(200).json({
            message: "Driver wallet details",
            status: "success",
            walletBalance,
            cashCollection,
            walletHistory: walletHistory
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong",
            status: "error",
            error: error.message
        });
    }
});

// exports.getDriverWallet = catchAsync(async (req, res, next) => {
//     try {
//         let driverId = req.driver._id;

//         const driver = await Driver.findById(driverId);
//         const walletHistory = await WalletHistory.find({ driverId }).sort({ createdAt: -1 });
//         const walletRequests = await WalletRequest.find({ driverId }).sort({ request_date: -1 });

//         // Format wallet requests to look like wallet history
//         const formattedRequests = walletRequests.map(req => ({
//             _id: req._id,
//             driverId: req.driverId,
//             action: "withdrawal_request",
//             amount: req.amount_requested,
//             balance_after_action: "", // or driver.wallet_balance if needed
//             description: `Withdrawal request (${req.status})`,
//             createdAt: req.request_date
//         }));

//         // Merge both arrays and sort by createdAt descending
//         const combinedHistory = [...walletHistory, ...formattedRequests].sort(
//             (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//         );

//         return res.status(200).json({
//             message: "Driver wallet details",
//             status: "success",
//             walletBalance: driver.wallet_balance,
//             cashCollection: driver.cashCollection,
//             walletHistory: combinedHistory
//         });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             message: "Something went wrong",
//             status: "error",
//             error: error.message
//         });
//     }
// });
