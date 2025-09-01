
const User = require("../../../models/user");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find().sort({ createdAt: -1 }); 

    return res.status(200).json({
        status: true,
        message: "Users fetched successfully",
        data: users
    });
});
