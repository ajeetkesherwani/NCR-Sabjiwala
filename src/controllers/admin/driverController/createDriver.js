const Driver = require("../../../models/driver");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");


exports.createDriver = catchAsync(async (req, res, next) => {
    // 1. Extract and validate body fields
    const { name, status, vehicleType, vehicleModel, registrationNumber, licenseNumber } = req.body;

    if (!name || !name.trim()) {
        return next(new AppError("Driver name is required.", 400));
    }
    if (!vehicleType || !vehicleType.trim()) {
        return next(new AppError("Vehicle type is required.", 400));
    }
    if (!vehicleModel || !vehicleModel.trim()) {
        return next(new AppError("Vehicle model is required.", 400));
    }
    if (!registrationNumber || !registrationNumber.trim()) {
        return next(new AppError("Vehicle registration number is required.", 400));
    }

    // 2. Handle profile image upload (assumes multer or similar)
    let imagePath = "";
    if (req.files && req.files.image && req.files.image.length > 0) {
        const img = req.files.image[0];
        imagePath = `${img.destination}/${img.filename}`;
    }

    // 3. Build the driver object
    const driverData = {
        name: name.trim(),
        image: imagePath,
        status: status && ["active", "inactive"].includes(status) ? status : undefined,
        vehicle: {
            type: vehicleType.trim(),
            model: vehicleModel.trim(),
            registrationNumber: registrationNumber.trim(),
            licenseNumber: licenseNumber ? licenseNumber.trim() : undefined
        }
    };

    // 4. Save to DB
    const driver = new Driver(driverData);
    await driver.save();

    // 5. Send response
    res.status(201).json({
        status: true,
        message: "Driver added successfully.",
        data: { driver },
        newDriver: true
    });
});
