const { mongoose } = require("mongoose");
const catchAsync = require("../../../utils/catchAsync");
const newOrder = require("../../../models/newOrder");

exports.getOrderChart = catchAsync(async (req, res) => {
    const vendorId = req.vendor.id;
    const range = parseInt(req.query.range) || 7;

    // Calculate UTC-based start date
    const now = new Date();
    const startDate = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()); // start of today UTC
    startDate.setDate(startDate.getDate() - (range - 1));

    // console.log("Date range filter from (UTC):", startDate.toISOString());

    const aggregation = await newOrder.aggregate([
        {
            $match: {
                vendorId: new mongoose.Types.ObjectId(vendorId),
                createdAt: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: "$serviceType", // group by serviceType
                count: { $sum: 1 },
                amount: { $sum: "$finalTotalPrice" }
            }
        }
    ]);

    // Default data
    let foodData = { name: "Food Orders", count: 0, amount: 0 };
    let martData = { name: "Mart Orders", count: 0, amount: 0 };

    aggregation.forEach(entry => {
        if (entry._id === "food") {
            foodData.count = entry.count;
            foodData.amount = entry.amount;
        } else if (entry._id === "grocery") {
            martData.count = entry.count;
            martData.amount = entry.amount;
        }
    });

    res.status(200).json({
        success: true,
        message: "Order chart fetched",
        data: [foodData, martData]
    });
});





// const catchAsync = require("../../../utils/catchAsync");

// exports.getOrderChart = catchAsync(async (req, res) => {
//     const range = req.query.range || "7";

//     const data = range === "7"
//         ? [
//             { name: 'Food Orders', count: 40, amount: 12000 },
//             { name: 'Mart Orders', count: 30, amount: 9000 },
//         ]
//         : [
//             { name: 'Food Orders', count: 150, amount: 45000 },
//             { name: 'Mart Orders', count: 110, amount: 33000 },
//         ];

//     res.status(200).json({
//         success: true,
//         message: "Order chart fetched",
//         data
//     });
// });
