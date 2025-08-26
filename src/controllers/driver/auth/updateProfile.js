const Driver = require("../../../models/driver");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.updateProfile = catchAsync(async (req, res, next) => {
    const driverId = req.driver._id;

    const { name, email, mobileNo, address, licenseNumber,adharNumber, vehicleType, vehicleModel, registrationNumber, insuranceNumber } = req.body;

    const driver = await Driver.findById(driverId);
    if (!driver) return next(new AppError("Driver not found", 404));

    // Check for mobile number uniqueness if changed
    if (mobileNo && mobileNo !== driver.mobileNo) {
        const mobileExists = await Driver.findOne({ mobileNo });
        if (mobileExists) return next(new AppError("Mobile number already in use", 400));
    }

    // Check for registration number uniqueness if changed
    if (registrationNumber && registrationNumber !== driver.vehicle.registrationNumber) {
        const regExists = await Driver.findOne({ "vehicle.registrationNumber": registrationNumber });
        if (regExists) return next(new AppError("Vehicle registration number already in use", 400));
    }

    const files = req.files || {};
    if (files.image) driver.image = files.image[0].path;
    if (files.vehicleRcImage) driver.vehicleRcImage = files.vehicleRcImage[0].path;
    if (files.insuranceImage) driver.insuranceImage = files.insuranceImage[0].path;
    if (files.licenseImage) driver.licenseImage = files.licenseImage[0].path;
    if (files.adharImage) driver.adharImage = files.adharImage[0].path;

    if (name) driver.name = name;
    if (email) driver.email = email;
    if (mobileNo) driver.mobileNo = mobileNo;
    if (address) driver.address = address;
    if (licenseNumber) driver.licenseNumber = licenseNumber;
    if (adharNumber) driver.adharNumber = adharNumber;

    if (vehicleType) driver.vehicle.type = vehicleType;
    if (vehicleModel) driver.vehicle.model = vehicleModel;
    if (registrationNumber) driver.vehicle.registrationNumber = registrationNumber;
    if (insuranceNumber) driver.vehicle.insuranceNumber = insuranceNumber;

    await driver.save();

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        driver
    });
});
