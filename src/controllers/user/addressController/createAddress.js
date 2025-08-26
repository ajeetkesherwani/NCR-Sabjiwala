const { default: axios } = require("axios");
const Address = require("../../../models/address");
const Setting = require("../../../models/settings");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const User = require("../../../models/user");
const serviceableAreas = require("../../../models/serviceableAreas");

exports.createAddress = catchAsync(async (req, res, next) => {
    let { name, address1, address2, city, pincode, state, personName, personMob, isDefault = true } = req.body;

    const userId = req.user._id;
    if (!userId) return next(new AppError("User not found", 404));
    if (!address1) return next(new AppError("Address 1 is required", 404));
    if (!city) return next(new AppError("City is required", 404));
    if (!pincode) return next(new AppError("Pincode is required", 404));
    if (!state) return next(new AppError("State is required", 404));

    // Check if the pincode is serviceable
    const serviceable = await serviceableAreas.findOne({
        pincode,
        status: "active",
        $or: [
            { isFoodAvailable: true },
            { isGroceryAvailable: true }
        ]
    });

    if (!serviceable) {
        return next(new AppError("Sorry, we don't deliver to this location yet", 400));
    }

    const setting = await Setting.findById("680f1081aeb857eee4d456ab");
    const apiKey = setting?.googleMapApiKey || "working";
    const addressStr = `${address1}, ${address2 || ''}, ${city}, ${state}, ${pincode}`.replace(/\s+/g, ' ').trim();

    let location = null;
    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressStr)}&key=${apiKey}`);
        if (response.data.status === "OK" && response.data.results[0]) {
            const { lat, lng } = response.data.results[0].geometry.location;
            location = {
                type: "Point",
                coordinates: [lng, lat] // GeoJSON: [long, lat]
            };
        }
    } catch (err) {
        console.error("Google Maps API error:", err);
    }

    // Check if user already has a default address
    const defaultExists = await Address.exists({ userId, isDefault: true });

    // If setting new default address, unset other defaults
    if (isDefault === true || (!defaultExists && isDefault !== false)) {
        await Address.updateMany({ userId }, { isDefault: false });
        isDefault = true;
    } else {
        isDefault = false;
    }

    const userData = await User.findById(userId);
    if (!userData) return next(new AppError("User not found", 404));

    if (!personName) {
        personName = userData.name || "";
    }
    if (!personMob) {
        personMob = userData.mobileNo || "";
    }

    const address = new Address({ userId, name, address1, address2, city, pincode, state, location, personName, personMob, isDefault });

    await address.save();

    // ✅ Update user's lat/long and location if this address isDefault
    if (isDefault && location?.coordinates?.length === 2) {
        const [lng, lat] = location.coordinates;

        await User.findByIdAndUpdate(userId, {
            lat: lat.toString(),
            long: lng.toString(),
            location: {
                type: "Point",
                coordinates: [lng, lat]
            }
        });
    }

    return res.status(201).json({
        status: true,
        message: "Address added successfully",
        data: { address },
        newAddress: true,
    });
});
