const Vendor = require("../../../models/vendor");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const {
  successResponse,
  errorResponse,
} = require("../../../utils/responseHandler");

exports.sendOtp = catchAsync(async (req, res, next) => {
  let { mobile, countryCode } = req.body;

  if (!mobile) return next(new AppError("mobile field is required.", 400));
  if (!countryCode)
    return next(new AppError("countryCode field is required.", 400));

  const otp = "1234";
  const otpExpires = Date.now() + 10 * 60 * 1000;

  let vendor = await Vendor.findOne({ mobile, countryCode });

  if (vendor) {
    vendor.otp = otp;
    vendor.otpExpires = otpExpires;
    await vendor.save();
  } else {
    vendor = await Vendor.create({
      mobile,
      countryCode,
      otp,
      otpExpires,
    });
  }

  // Optionally send SMS
  // await sendSms(`${countryCode}${mobile}`, `Your OTP is ${otp}`);

  successResponse(res, "OTP sent successfully", {
    otp: process.env.NODE_ENV === "development" ? otp : "1234", // Mask OTP outside dev
  });
});
