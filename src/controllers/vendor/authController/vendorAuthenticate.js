const jwt = require("jsonwebtoken");

const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const Vendor = require("../../../models/vendor");

exports.vendorAuthenticate = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization?.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookie?.xcvbexamstons) {
    token = req.cookie?.xcvbexamstons;
  }

  if (!token) {
    return next(new AppError("You are not loggedin.", 404));
  }

  // token verify
  const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

  //Step3. check user not removed
  const vendor = await Vendor.findById(decoded.id);
  if (!vendor) {
    return next(new AppError("Vendor not exist.", 404));
  }

  //Step4. check password update
  // if (await vendor.validatePasswordUpdate(decoded.iat)) {
  //   return next(new AppError("Password updated login again.", 404));
  // }

  req.vendor = vendor;
  next();
});
