const { default: mongoose } = require("mongoose");
const newOrder = require("../../../models/newOrder");
const catchAsync = require("../../../utils/catchAsync");

exports.getEarningChart = catchAsync(async (req, res) => {
    const vendorId = req.vendor.id;
    const range = parseInt(req.query.range) || 7;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (range - 1));
    startDate.setHours(0, 0, 0, 0);

    const earnings = await newOrder.aggregate([
        {
            $match: {
                vendorId: new mongoose.Types.ObjectId(vendorId),
                createdAt: { $gte: startDate }
            }
        },
        {
            $project: {
                finalTotalPrice: 1,
                date: {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                }
            }
        },
        {
            $group: {
                _id: "$date",
                revenue: { $sum: "$finalTotalPrice" }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);

    // console.log("Earnings aggregation result:", earnings);

    // Fill missing dates with 0 revenue
    const data = [];
    for (let i = 0; i < range; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        const dayLabel = range === 7
            ? date.toLocaleDateString('en-US', { weekday: 'short' }) // 'Mon', 'Tue', etc.
            : `D${i + 1}`; // For 30-day view

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



// const catchAsync = require("../../../utils/catchAsync");

// exports.getEarningChart = catchAsync(async (req, res) => {
//     const range = req.query.range || "7";

//     const data = range === "7"
//         ? [
//             { day: 'Mon', revenue: 240 },
//             { day: 'Tue', revenue: 139 },
//             { day: 'Wed', revenue: 980 },
//             { day: 'Thu', revenue: 390 },
//             { day: 'Fri', revenue: 480 },
//             { day: 'Sat', revenue: 380 },
//             { day: 'Sun', revenue: 430 },
//         ]
//         : Array.from({ length: 30 }, (_, i) => ({
//             day: `D${i + 1}`,
//             revenue: Math.floor(Math.random() * 800 + 200),
//         }));

//     res.status(200).json({
//         success: true,
//         message: "Earning chart fetched",
//         data
//     });
// });
