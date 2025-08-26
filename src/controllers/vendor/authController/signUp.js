const Vendor = require("../../../models/vendor");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const bcrypt = require('bcrypt');

exports.signUp = catchAsync(async (req, res, next) => {
  let { name, userId, password, mobile, alternateMobile, benificiaryName, email, panNo, gstNo, foodLicense, ifsc, bankName, branchName, accountNo, agreement, deviceId, deviceToken } = req.body;

  const files = req.files;
  const profileImg = files.profileImg && files.profileImg[0] ? files.profileImg[0].path : "";
  const panImage = files.panImage && files.panImage[0] ? files.panImage[0].path : "";
  const gstImage = files.gstImage && files.gstImage[0] ? files.gstImage[0].path : "";
  const foodImage = files.foodImage && files.foodImage[0] ? files.foodImage[0].path : "";
  const passbook = files.passbook && files.passbook[0] ? files.passbook[0].path : "";

  userId = userId.toLowerCase();

  if (!name) return next(new AppError("Name is required.", 400));
  if (!userId) return next(new AppError("User ID is required.", 400));
  if (!password) return next(new AppError("Password is required.", 400));
  if (!mobile) return next(new AppError("Mobile number is required.", 400));
  if (!panNo) return next(new AppError("PAN number is required.", 400));
  if (!panImage) return next(new AppError("PAN image is required.", 400));

  const vendoruserId = await Vendor.findOne({ userId });
  if (vendoruserId) return next(new AppError("User Id is already exists. Plz enter different User Id.", 400));
  const vendorMobile = await Vendor.findOne({ mobile });
  if (vendorMobile) return next(new AppError("Mobile No is already exists. Plz enter different Mobile No.", 400));

  var hashPassword = await bcrypt.hash(password, 12)

  const newVendor = await Vendor.create({
    name, userId, password: hashPassword, mobile, benificiaryName,
    alternateMobile, email,
    profileImg, panNo, gstNo, foodLicense,
    panImage, gstImage, foodImage,
    ifsc, bankName, branchName, accountNo, passbook, agreementAccepted: agreement || false, deviceId, deviceToken
  });

  return res.status(201).json({
    success: true,
    message: "Vendor registered successfully",
    vendor: newVendor
  });
});
