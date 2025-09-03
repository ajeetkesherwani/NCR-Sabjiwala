const Driver = require("../../../models/driver");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const { successResponse } = require("../../../utils/responseHandler");

exports.sendOtp = catchAsync(async (req, res, next) => {

    let { mobile } = req.body;
    if (!mobile) return next(new AppError("mobile is required", 400));

    const driver = await Driver.findOne({ mobileNo:mobile });
    if (!driver) return next(new AppError("Driver not registerd", 400));

    if (!driver.isRegistered) return next(
        new AppError("You are not verified. wait for verification", 403)
    );
    
    if (driver.isBlocked) return next(new AppError("you are blocked", 403));

    const otpCode = "1234";
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    driver.otp = {
        code: otpCode,
        expiresAt: otpExpiry
    };


    await driver.save();

    successResponse(res, "Otp send successfully", otpCode);

});