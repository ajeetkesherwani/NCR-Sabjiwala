const catchAsync = require("../../../utils/catchAsync");

exports.getHomeData = (req, res, next) => {
    const today = { totalOrders: 5, totalIncome: 750 };
    const last7Days = { totalOrders: 38, totalIncome: 5400 };
    const last30Days = { totalOrders: 160, totalIncome: 22000 };

    res.status(200).json({
        success: true,
        message: "Driver home data fetched successfully",
        data: { today, last7Days, last30Days }
    });
};
