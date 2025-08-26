const jwt = require("jsonwebtoken");
const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/AppError");
const Driver = require("../../../models/driver");

exports.driverAuthenticate = catchAsync(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return next(new AppError("Not authenticated", 401));

    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    const driver = await Driver.findById(decoded.id);
    if (!driver) return next(new AppError("Driver does not exist", 404));

    req.driver = driver;
    next();
});
