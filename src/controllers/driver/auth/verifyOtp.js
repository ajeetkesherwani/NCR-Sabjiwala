const Driver = require("../../../models/driver");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const createToken = require("../../../utils/createToken");
const {
  successResponse,
  errorResponse,
} = require("../../../utils/responseHandler");

exports.verifyOtp = catchAsync(async (req, res, next) => {
  const { mobile, otp } = req.body;
  if (!mobile || !otp)
    return next(new AppError("mobile and otp is required", 400));

  const driver = await Driver.findOne({ mobile });
  if (!driver)
    errorResponse(res, "Driver not found with this mobile number", 400);

  if (!driver.otp || !driver.otpExpire) {
    errorResponse(res, "OTP not found or expired.", 400);
  }

  if (driver.otp !== otp) {
    errorResponse(res, "Invalid OTP.", 400);
  }
  console.log("driver", driver);
  if (
    !driver.otp ||
    driver.otp !== otp ||
    !driver.otpExpire ||
    new Date() > new Date(driver.otpExpire)
  ) {
    errorResponse(res, "Invalid or expired OTP.", 400);
  }

  // OTP is valid → clear OTP
  driver.otp = undefined;
  driver.otpExpires = undefined;
  await driver.save();

  await driver.save();

  // Check registration status
  const isRegistered =
    driver.status === true &&
    driver.isVerified === true &&
    driver.isBlocked === false;

  if (!isRegistered) {
    // OTP is verified but driver is not yet approved or blocked
    return res.status(200).json({
      success: true,
      message:
        "OTP verified, but driver is not registered (not verified or blocked).",
      isRegistered: false,
    });
  }

  // driver is verified and not blocked → login
  createToken(driver, 200, res, {
    message: "OTP verified and vendor is registered.",
    isRegistered: true,
  });
});
