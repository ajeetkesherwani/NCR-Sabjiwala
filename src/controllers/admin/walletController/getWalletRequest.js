const WalletRequest = require("../../../models/walletRequest");
const catchAsync = require("../../../utils/catchAsync");

exports.getWalletRequest = catchAsync(async (req, res, next) => {
    try {
        const type = req.query.type; // 'vendor' or 'driver'

        if (type !== 'vendor' && type !== 'driver') {
            return res.status(400).json({
                message: "Invalid type parameter. Use 'vendor' or 'driver'.",
                status: "notsuccess"
            });
        }

        // Build filter condition based on type
        const filter = type === 'vendor'
            ? { vendorId: { $ne: null } }
            : { driverId: { $ne: null } };

        const wallet_request = await WalletRequest
            .find(filter)
            .sort({ request_date: -1 })
            .populate("vendorId", "name wallet_balance")
            .populate("driverId", "name wallet_balance") // in case you want to show driver details too
            .lean();

        return res.status(200).json({
            message: `${type.charAt(0).toUpperCase() + type.slice(1)} wallet request`,
            status: "success",
            wallet_request
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
