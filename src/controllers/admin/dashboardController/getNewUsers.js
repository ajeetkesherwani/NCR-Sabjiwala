const User = require("../../../models/user");
const catchAsync = require("../../../utils/catchAsync");

exports.getNewUsers = catchAsync(async (req, res) => {
    try {
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        const newUsers = await User.find({ createdAt: { $gte: thirtyDaysAgo, $lte: today } }).limit(15)

        return res.status(200).json({
            status: true,
            message: "New users fetched successfully",
            data: newUsers
        });

    } catch (error) {
        return res.status(500).json({ status: false, message: "Something went wrong", error: error.message });
    }
});