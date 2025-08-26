const mongoose = require("mongoose");
const newOrder = require("../../../models/newOrder");
const catchAsync = require("../../../utils/catchAsync");

exports.getAverageOrderChart = catchAsync(async (req, res) => {
    const duration = parseInt(req.query.duration) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (duration - 1));
    startDate.setHours(0, 0, 0, 0);

    const orders = await newOrder.aggregate([
        {
            $match: { createdAt: { $gte: startDate } }
        },
        {
            $project: {
                finalTotalPrice: 1,
                date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
            }
        },
        {
            $group: {
                _id: "$date",
                total: { $sum: "$finalTotalPrice" },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // Fill missing dates with zero values
    const data = [];
    for (let i = 0; i < duration; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        const entry = orders.find(o => o._id === dateStr);
        data.push({
            day: dateStr,
            average: entry && entry.count > 0 ? (entry.total / entry.count) : 0
        });
    }

    res.status(200).json({
        success: true,
        message: "Average order chart fetched",
        data
    });
});