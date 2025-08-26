const Address = require("../../../models/address");
const User = require("../../../models/user");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");



exports.updateAddress = catchAsync(async (req, res, next) => {
    const { addressId } = req.params;
    const userId = req.user._id;

    // Find the address and ensure it belongs to the user
    let address = await Address.findOne({ _id: addressId, userId });
    if (!address) return next(new AppError("Address not found", 404));

    // Update fields
    const { name, address1, address2, city, pincode, state, isDefault, status } = req.body;

    if (name !== undefined) address.name = name;
    if (address1 !== undefined) address.address1 = address1;
    if (address2 !== undefined) address.address2 = address2;
    if (city !== undefined) address.city = city;
    if (pincode !== undefined) address.pincode = pincode;
    if (state !== undefined) address.state = state;
    if (status !== undefined) address.status = status;

    // Handle isDefault
    if (typeof isDefault === "boolean") {
        if (isDefault) {
            // Unset other default addresses for this user
            await Address.updateMany({ userId, _id: { $ne: addressId } }, { $set: { isDefault: false } });

            // ✅ Update user's location from this address
            const [long, lat] = address.location.coordinates;

            await User.findByIdAndUpdate(userId, {
                lat: lat.toString(),
                long: long.toString(),
                location: {
                    type: "Point",
                    coordinates: [long, lat]
                }
            });
        }

        address.isDefault = isDefault;
    }

    await address.save();

    return res.status(200).json({
        status: true,
        message: "Address updated successfully",
        data: { address },
    });
});


// -----------------------------------------------------
// update address but not set to user location ( Old code )
// -----------------------------------------------------
// exports.updateAddress = catchAsync(async (req, res, next) => {
//     const {addressId} = req.params;
//     const userId = req.user._id;

//     // Find the address and ensure it belongs to the user
//     let address = await Address.findOne({ _id: addressId, userId });
//     if (!address) return next(new AppError("Address not found", 404));

//     // Update fields
//     const { name, address1, address2, city, pincode, state, isDefault, status } = req.body;

//     if (name !== undefined) address.name = name;
//     if (address1 !== undefined) address.address1 = address1;
//     if (address2 !== undefined) address.address2 = address2;
//     if (city !== undefined) address.city = city;
//     if (pincode !== undefined) address.pincode = pincode;
//     if (state !== undefined) address.state = state;
//     if (status !== undefined) address.status = status;

//     // Handle isDefault
//     if (typeof isDefault === "boolean") {
//         if (isDefault) {
//             // Unset other default addresses for this user
//             await Address.updateMany({ userId, _id: { $ne: addressId } }, { $set: { isDefault: false } });
//         }
//         address.isDefault = isDefault;
//     }

//     await address.save();

//     return res.status(200).json({
//         status: true,
//         message: "Address updated successfully",
//         data: { address },
//     });
// });
