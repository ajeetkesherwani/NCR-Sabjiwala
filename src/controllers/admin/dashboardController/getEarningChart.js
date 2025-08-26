const mongoose = require("mongoose");
const newOrder = require("../../../models/newOrder");
const catchAsync = require("../../../utils/catchAsync");

exports.getEarningChart = catchAsync(async (req, res) => {
    const range = parseInt(req.query.range) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (range - 1));
    startDate.setHours(0, 0, 0, 0);

    const earnings = await newOrder.aggregate([
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
                revenue: { $sum: "$finalTotalPrice" }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // Fill missing dates with 0 revenue
    const data = [];
    for (let i = 0; i < range; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        const dayLabel = range === 7
            ? date.toLocaleDateString('en-US', { weekday: 'short' })
            : `D${i + 1}`;
        const entry = earnings.find(e => e._id === dateStr);
        data.push({
            day: dayLabel,
            revenue: entry ? entry.revenue : 0
        });
    }

    res.status(200).json({
        success: true,
        message: "Earning chart fetched",
        data
    });
});