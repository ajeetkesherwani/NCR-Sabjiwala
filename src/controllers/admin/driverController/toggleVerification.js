const Driver = require("../../../models/driver");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.toggleVerification = catchAsync(async (req, res, next) => {
    const { driverId } = req.params;
    const { status } = req.body;
    const driver = await Driver.findByIdAndUpdate(driverId, { isVerified: status }, { new: true });
    if (!driver) return next(new AppError("Driver not found", 404));

    res.status(200).json({
        success: true,
        message: `Driver status is now ${status}`,
        driver
    }); 
});