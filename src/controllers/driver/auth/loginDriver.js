const Driver = require("../../../models/driver");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const createToken = require("../../../utils/createToken");

exports.loginDriver = catchAsync(async (req, res, next) => {
    const { mobileNo, password, deviceId, deviceToken } = req.body;

    if (!mobileNo || !password) {
        return next(new AppError("Mobile No and Password are required.", 400));
    }

    const driver = await Driver.findOne({ mobileNo });

    if (!driver || !(await bcrypt.compare(password, driver.password))) {
        return next(new AppError("Invalid mobile no or password.", 404));
    }

    if (driver.isBlocked) {
        return next(new AppError("Your account is blocked. Please contact support.", 403));
    }

    driver.deviceId = deviceId || driver.deviceId;
    driver.deviceToken = deviceToken || driver.deviceToken;
    await driver.save();

    createToken(driver, 200, res);
});