const Driver = require("../../../models/driver");
const Vendor = require("../../../models/vendor");
const catchAsync = require("../../../utils/catchAsync");

exports.payoutList = catchAsync(async (req, res) => {
    const { query } = req;
    const filter = {};
    // const filter = { status: true };

    // payoutType: 'daily', 'weekly', 'monthly'
    if (query.type === "daily") {
        filter.payoutType = "daily";
    } else if (query.type === "weekly") {
        filter.payoutType = "weekly";
    } else if (query.type === "monthly") {
        filter.payoutType = "monthly";
    }

    let data;
    let Model = query.tab === 'vendor' ? Vendor : Driver;

    // Get list of vendors or drivers
    // const list = await Model.find().sort({ createdAt: -1 });
    const list = await Model.find(filter).sort({ createdAt: -1 });

    // Get counts by payout type
    const [counts] = await Model.aggregate([
        {
            $facet: {
                all: [{ $count: "total" }],
                daily: [{ $match: { payoutType: "daily" } }, { $count: "count" }],
                weekly: [{ $match: { payoutType: "weekly" } }, { $count: "count" }],
                monthly: [{ $match: { payoutType: "monthly" } }, { $count: "count" }]
            }
        },
        {
            $project: {
                all: { $arrayElemAt: ["$all.total", 0] },
                daily: { $arrayElemAt: ["$daily.count", 0] },
                weekly: { $arrayElemAt: ["$weekly.count", 0] },
                monthly: { $arrayElemAt: ["$monthly.count", 0] }
            }
        }
    ]);

    // Structure the response based on tab
    if (query.tab === 'vendor') {
        data = { vendors: list };
    } else {
        data = { drivers: list };
    }

    return res.status(200).json({
        status: true,
        results: list.length,
        data: {
            ...data,
            counts: {
                all: counts.all || 0,
                daily: counts.daily || 0,
                weekly: counts.weekly || 0,
                monthly: counts.monthly || 0
            }
        }
    })

})