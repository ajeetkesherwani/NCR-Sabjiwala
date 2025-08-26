
const User = require("../../../models/user");
const catchAsync = require("../../../utils/catchAsync");

exports.getUserDetails = catchAsync(async (req, res) => {
    const { userId } = req.params;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
        return next(new AppError("User not found", 404));
    }

    return res.status(200).json({
        status: true,
        message: "user detailed fetched",
        data: { user }
    });
});
