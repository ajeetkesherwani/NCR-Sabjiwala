const User = require("../../../models/user");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.blockUser = catchAsync(async (req, res, next) => {
    const { userId } = req.params;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
        return next(new AppError("User not found", 404));
    }

    // Toggle the status (block/unblock)
    user.status = !user.status;

    await user.save();

    return res.status(200).json({
        status: true,
        message: user.status ? "User unblocked successfully" : "User blocked successfully",
        data: {
            userId: user._id,
            status: user.status
        }
    });
});
