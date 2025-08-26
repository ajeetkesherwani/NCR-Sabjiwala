const Driver = require("../../../models/driver");
const Shop = require("../../../models/shop");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");


exports.driverDetails = catchAsync(async (req, res, next) => {

    let driverId = req.params.driverId
    // console.log("shopId", shopId);

    const driver = await Driver.findOne({ _id: driverId });

    if (!driver) return next(new AppError("Driver is not found", 404));

    return res.status(201).json({
        success: true,
        message: "Shop details",
        driver: driver
    });

})