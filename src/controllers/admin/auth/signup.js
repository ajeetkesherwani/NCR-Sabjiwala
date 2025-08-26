const Admin = require("../../../models/admin");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.signup = catchAsync(async (req, res) => {
    let { name, email, phoneNo, password, address, bio } = req.body
    if (!name) return next(new AppError("name is required", 404));

    const admin = new Admin({ name, email, phoneNo, password, address, bio });
    await admin.save();

    return res.status(201).json({
        status: true,
        message: "Account Created",
        data: { admin },
    });

})