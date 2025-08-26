
const User = require("../../../models/user");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res) => {
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
        filter.status = true;
    } else if (type === "unverified") {
        filter.isVerified = false;
        filter.status = true;
    } else if (type === "block") {
        filter.status = false;
    }
    // if type is "all" or undefined, no filter will be applied

    // Fetch users based on filter
    const users = await User.find(filter).sort({ createdAt: -1 });

    // Get counts for all categories
    const counts = {
        all: await User.countDocuments({}),
        new: await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo }, isVerified: false }),
        verified: await User.countDocuments({ isVerified: true, status: true }),
        unverified: await User.countDocuments({ isVerified: false, status: true }),
        block: await User.countDocuments({ status: false })
    };

    return res.status(200).json({
        status: true,
        message: "Users fetched successfully",
        results: users.length,
        data: users,
        counts
    });
});
