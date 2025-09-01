const Admin = require("../../../models/admin");
const bcrypt = require("bcrypt");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const createToken = require("../../../utils/createToken");

exports.login = catchAsync(async (req, res, next) => {
  console.log("working");
  let { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("email and password are required.", 404));

  const admin = await Admin.findOne({ email });

  if (!admin || !(await admin.matchPassword(password)))
    return next(new AppError("Invalid email or password.", 404));

  createToken(admin, 200, res);
});
