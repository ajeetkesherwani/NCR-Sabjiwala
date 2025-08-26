const { default: mongoose } = require("mongoose");
const Driver = require("../../../models/driver");
const Vendor = require("../../../models/vendor");
const WalletHistory = require("../../../models/walletHistory");
const catchAsync = require("../../../utils/catchAsync");

exports.walletHistoryOfVendor = catchAsync(async (req, res) => {
    const { vendorId } = req.params;
    if (!vendorId) {
        return res.status(400).json({
            status: false,
            message: "Vendor ID is required"
        });
    }

    // Get wallet history with selected vendor details
    const history = await WalletHistory.find({ vendorId })
        .sort({ createdAt: -1 });

    return res.status(200).json({
        status: true,
        results: history.length,
        data: {
            history
        }
    });
})