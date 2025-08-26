const Vendor = require("../../../models/vendor");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const bcrypt = require('bcrypt');

exports.forgetPassword = catchAsync(async (req, res, next) => {

    const { userId, password } = req.body

    const vendor = await Vendor.findOne({ userId });
    if (!vendor) return next(new AppError("Invalid email id", 400));

    if (!password) return next(new AppError("Password is required", 400));

    const hashedPassword = await bcrypt.hash(password, 12);
    vendor.password = hashedPassword;
    await vendor.save();

    return res.status(201).json({
        status: true,
        message: "Vendor password changed successfully!",
        data: { vendor },
        newVendor: true,
    });

})