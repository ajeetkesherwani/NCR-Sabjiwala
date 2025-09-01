const Driver = require("../../../models/driver");
const Product = require("../../../models/product");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getProfile = catchAsync(async (req, res, next) => {

    let driver = await Driver.findById(req.driver._id);

    return res.status(200).json({
        status: true,
        message: "Driver Profile",
        driver
    });
});