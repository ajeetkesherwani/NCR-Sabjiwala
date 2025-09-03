const Driver = require("../../../models/driver");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const bcrypt = require('bcrypt');

exports.registerDriver = catchAsync(async (req, res, next) => {
    const {
        name,
        email,
        mobileNo,
        address,
        aadharNumber,
        vehicleType,
        vehicleNumber,
        dlNumber,
        deviceId,
        deviceToken,
        password // not in schema but assuming you want to hash and store it elsewhere?
    } = req.body;

    // Validate required fields manually if needed
    if (!name || !email || !mobileNo || !vehicleType || !vehicleNumber || !dlNumber || !deviceId || !deviceToken) {
        return next(new AppError("Missing required fields.", 400));
    }

    const emailExists = await Driver.findOne({ email });
    if (emailExists) return next(new AppError("Email already exists.", 400));

    const mobileExists = await Driver.findOne({ mobileNo });
    if (mobileExists) return next(new AppError("Mobile number already exists.", 400));

    const regExists = await Driver.findOne({ vehicleNumber });
    if (regExists) return next(new AppError("Vehicle registration number already exists.", 400));

    const files = req.files || {};

    const image = files.image?.[0]?.path || "";
    const rcFrontImage = files.rcFrontImage?.[0]?.path || "";
    const rcBackImage = files.rcBackImage?.[0]?.path || "";
    const adharImage = files.adharImage?.[0]?.path || "";

    // If you intend to use password for authentication, hash it
    let hashedPassword;
    if (password) {
        hashedPassword = await bcrypt.hash(password, 12);
    }

    const newDriver = await Driver.create({
        name,
        email,
        mobileNo,
        address,
        image,
        aadharNumber,
        adharImage,
        vehicleType,
        vehicleNumber,
        rcFrontImage,
        rcBackImage,
        dlNumber,
        deviceId,
        deviceToken,
        // Optional fields not in schema can be added to schema if needed
    });

    res.status(201).json({
        success: true,
        message: "Driver registered successfully",
        driver: newDriver
    });
});
