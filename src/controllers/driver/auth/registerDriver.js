const Driver = require("../../../models/driver");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const bcrypt = require('bcrypt');

exports.registerDriver = catchAsync(async (req, res, next) => {
    const {
        name, email, mobileNo, password, address, licenseNumber,
        vehicleType, vehicleModel, registrationNumber, insuranceNumber, deviceId, deviceToken
    } = req.body;

    const emailExists = await Driver.findOne({ email });
    if (emailExists) return next(new AppError("Email already exists.", 400));

    const mobileExists = await Driver.findOne({ mobileNo });
    if (mobileExists) return next(new AppError("Mobile number already exists.", 400));

    const regExists = await Driver.findOne({ "vehicle.registrationNumber": registrationNumber });
    if (regExists) return next(new AppError("Vehicle registration number already exists.", 400));

    const files = req.files || {};

    const image = files.image?.[0]?.path || "";
    const vehicleRcImage = files.vehicleRcImage?.[0]?.path || "";
    const insuranceImage = files.insuranceImage?.[0]?.path || "";
    const licenseImage = files.licenseImage?.[0]?.path || "";
    const adharImage = files.adharImage?.[0]?.path || "";

    var hashPassword = await bcrypt.hash(password, 12)

    const newDriver = await Driver.create({
        name, email, mobileNo, address, licenseNumber,
        password: hashPassword,
        vehicle: {
            type: vehicleType,
            model: vehicleModel,
            registrationNumber,
            insuranceNumber
        },
        image,
        vehicleRcImage,
        insuranceImage,
        licenseImage,
        adharImage,
        deviceId,
        deviceToken
    });

    res.status(201).json({
        success: true,
        message: "Driver registered successfully",
        driver: newDriver
    });
});
