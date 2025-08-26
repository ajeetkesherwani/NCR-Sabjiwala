const Driver = require("../../../models/driver");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.toggleStatus = catchAsync(async (req, res, next) => {
    const { driverId } = req.params;
    const { status } = req.body; 

    const driver = await Driver.findByIdAndUpdate(driverId, { status }, { new: true });
    if (!driver) return next(new AppError("Driver not found", 404));

    res.status(200).json({
        success: true,
        message: `Driver is now ${status}`,
        driver
    });
});