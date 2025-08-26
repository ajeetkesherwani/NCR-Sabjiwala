const Driver = require("../../../models/driver")
const catchAsync = require("../../../utils/catchAsync")

exports.getDriver = catchAsync(async (req, res) => {
    const { type } = req.query;
    let filter = {};
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Apply filters based on type
    if (type === "new") {
        filter.createdAt = { $gte: thirtyDaysAgo };
        filter.isVerified = false;
    } else if (type === "verified") {
        filter.isVerified = true;
        filter.isBlocked = false;
    } else if (type === "unverified") {
        filter.isVerified = false;
        filter.isBlocked = false;
    } else if (type === "block") {
        filter.isBlocked = true;
    }
    // if type is "all" or undefined, no filter will be applied

    // Fetch drivers based on filter
    const drivers = await Driver.find(filter).sort({ createdAt: -1 });

    // Get counts for all categories
    const counts = {
        all: await Driver.countDocuments({}),
        new: await Driver.countDocuments({ createdAt: { $gte: thirtyDaysAgo }, isVerified: false }),
        verified: await Driver.countDocuments({ isVerified: true, isBlocked: false }),
        unverified: await Driver.countDocuments({ isVerified: false, isBlocked: false }),
        block: await Driver.countDocuments({ isBlocked: true })
    };

    return res.status(200).json({
        status: true,
        results: drivers.length,
        data: drivers,
        counts
    })
})