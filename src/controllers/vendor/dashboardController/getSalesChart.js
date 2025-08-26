const mongoose = require("mongoose");
const catchAsync = require("../../../utils/catchAsync");
const newOrder = require("../../../models/newOrder");

exports.getSalesChart = catchAsync(async (req, res) => {
    const vendorId = req.vendor.id;
    const range = parseInt(req.query.range) || 7;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (range - 1));
    startDate.setHours(0, 0, 0, 0);

    const orders = await newOrder.aggregate([
        {
            $match: {
                vendorId: new mongoose.Types.ObjectId(vendorId),
                createdAt: { $gte: startDate }
            }
        },
        {
            $project: {
                serviceType: 1,
                finalTotalPrice: 1,
                date: {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                }
            }
        },
        {
            $group: {
                _id: "$date",
                food: {
                    $sum: {
                        $cond: [
                            { $eq: ["$serviceType", "food"] },
                            "$finalTotalPrice",
                            0
                        ]
                    }
                },
                mart: {
                    $sum: {
                        $cond: [
                            { $eq: ["$serviceType", "grocery"] },
                            "$finalTotalPrice",
                            0
                        ]
                    }
                }
            }
        },
        {
            $sort: { _id: 1 }
        }
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





// const catchAsync = require("../../../utils/catchAsync");

// exports.getSalesChart = catchAsync(async (req, res) => {
//     const range = req.query.range || "7";

//     const data = range === "7"
//         ? [
//             { day: 'Mon', food: 400, mart: 240 },
//             { day: 'Tue', food: 300, mart: 139 },
//             { day: 'Wed', food: 200, mart: 980 },
//             { day: 'Thu', food: 278, mart: 390 },
//             { day: 'Fri', food: 189, mart: 480 },
//             { day: 'Sat', food: 239, mart: 380 },
//             { day: 'Sun', food: 349, mart: 430 },
//         ]
//         : Array.from({ length: 30 }, (_, i) => ({
//             day: `D${i + 1}`,
//             food: Math.floor(Math.random() * 500 + 100),
//             mart: Math.floor(Math.random() * 500 + 100),
//         }));

//     res.status(200).json({
//         success: true,
//         message: "Sales chart fetched",
//         data
//     });
// });
