const mongoose = require("mongoose");
const newOrder = require("../../../models/newOrder");
const catchAsync = require("../../../utils/catchAsync");

exports.getSalesChart = catchAsync(async (req, res) => {
    const range = parseInt(req.query.range) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (range - 1));
    startDate.setHours(0, 0, 0, 0);

    const orders = await newOrder.aggregate([
        {
            $match: { createdAt: { $gte: startDate } }
        },
        {
            $project: {
                serviceType: 1,
                finalTotalPrice: 1,
                date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
            }
        },
        {
            $group: {
                _id: "$date",
                food: {
                    $sum: {
                        $cond: [{ $eq: ["$serviceType", "food"] }, "$finalTotalPrice", 0]
                    }
                },
                mart: {
                    $sum: {
                        $cond: [{ $eq: ["$serviceType", "grocery"] }, "$finalTotalPrice", 0]
                    }
                }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // Fill missing dates with zero values
    const result = [];
    for (let i = 0; i < range; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dateStr = date.toISOString().split("T")[0];
        const dayData = orders.find(o => o._id === dateStr);
        result.push({
            day: dateStr,
            food: dayData?.food || 0,
            mart: dayData?.mart || 0
        });
    }

    res.status(200).json({
        success: true,
        message: "Sales chart fetched",
        data: result
    });
});