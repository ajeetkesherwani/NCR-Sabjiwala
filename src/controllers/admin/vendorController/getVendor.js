const Vendor = require("../../../models/vendor");
const catchAsync = require("../../../utils/catchAsync");

exports.getVendor = catchAsync(async (req, res) => {

    const { query } = req;
    const filter = {}

    // Apply filters based on query
    if (query.type === "new") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filter.createdAt = { $gte: thirtyDaysAgo };
        filter.status = false;
    } else if (query.type === "approve") {
        filter.status = true;
        // filter.isBlocked = false;
    } else if (query.type === "unapprove") {
        filter.status = false;
        // filter.isBlocked = false;
    } else if (query.type === "block") {
        filter.isBlocked = true;
    }

    // const vendors = await Vendor.find().sort({"createdAt": -1});
    const vendors = await Vendor.aggregate([
        {
            $match: filter
        },
        {
            $lookup: {
                from: "shops", // collection name in MongoDB (case-sensitive)
                localField: "_id",
                foreignField: "vendorId",
                as: "shops"
            }
        },
        {
            $addFields: {
                shopCount: { $size: "$shops" }
            }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $project: {
                shops: 0, // omit full shop data if not needed
                password: 0 // optional: exclude sensitive fields
            }
        }
    ]);


    // Count stats
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const [counts] = await Vendor.aggregate([
        {
            $facet: {
                all: [{ $count: "total" }],
                new: [
                    {
                        $match: {
                            createdAt: { $gte: thirtyDaysAgo },
                            status: false
                        }
                    },
                    { $count: "count" }
                ],
                approve: [
                    { $match: { status: true } },
                    { $count: "count" }
                ],
                unapprove: [
                    { $match: { status: false } },
                    { $count: "count" }
                ],
                block: [
                    { $match: { isBlocked: true } },
                    { $count: "count" }
                ]
            }
        },
        {
            $project: {
                all: { $arrayElemAt: ["$all.total", 0] },
                new: { $arrayElemAt: ["$new.count", 0] },
                approve: { $arrayElemAt: ["$approve.count", 0] },
                unapprove: { $arrayElemAt: ["$unapprove.count", 0] },
                block: { $arrayElemAt: ["$block.count", 0] }
            }
        }
    ]);


    return res.status(200).json({
        status: true,
        results: vendors.length,
        data: {
            vendors,
            counts: {
                all: counts.all || 0,
                new: counts.new || 0,
                approve: counts.approve || 0,
                unapprove: counts.unapprove || 0,
                block: counts.block || 0
            }
        }
    })

})