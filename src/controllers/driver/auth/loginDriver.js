const Driver = require("../../../models/driver");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const createToken = require("../../../utils/createToken");

exports.loginDriver = catchAsync(async (req, res, next) => {
    const { mobileNo, otp, deviceId, deviceToken } = req.body;

    if (!mobileNo || !otp) {
        return next(new AppError("Mobile No and Otp are required.", 400));
    }

    const driver = await Driver.findOne({ mobileNo });

    if (!driver) {
        return next(new AppError("Doctor not found with this number", 404));
    }

     if (
        !driver.otp ||
        driver.otp.code !== otp ||
        new Date(driver.otp.expiresAt) < new Date()
    ) {
        return next(new AppError("Invalid or expired OTP.", 400));
    }

    // Update device info
    driver.deviceId = deviceId || driver.deviceId;
    driver.deviceToken = deviceToken || driver.deviceToken;

    // Optional: Clear OTP after successful login
    driver.otp = undefined;

    await driver.save();

    // Assuming createToken sets the JWT cookie and sends response
    createToken(driver, 200, res);
});