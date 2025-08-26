const Admin = require("../../../models/admin");
const Role = require("../../../models/role");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const createToken = require("../../../utils/createToken");

exports.login = catchAsync(async (req, res, next) => {
    let { email, password } = req.body
    if (!email || !password) return next(new AppError("email and password are required.", 404));

    const admin = await Admin.findOne({ email });

    if (!admin || !(await admin.matchPassword(password))) return next(new AppError("Invalid email or password.", 404));

    let role = null;
    if (admin.isSuperAdmin === false) {
        role = await Role.findById(admin.role);
    }

    createToken(admin, 200, res, false, { role });

})