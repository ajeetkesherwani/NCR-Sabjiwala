const UserAddress = require("../../../models/address");
const catchAsync = require("../../../utils/catchAsync");

exports.updateAddress = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const addressID = req.params.addressId;
  const updateData = req.body;

  console.log("User ID:", userId);
  console.log("Address ID:", addressID);
  console.log("Update Data:", updateData);

  if (!addressID) {
    return res.status(400).json({
      success: false,
      message: "Address ID is required",
    });
  }

  const userAddress = await UserAddress.findOne({ userId });

  if (!userAddress) {
    return res.status(400).json({
      success: false,
      message: "User address document not found",
    });
  }

  const address = userAddress.addresses.id(req.params.addressId);

  if (!address) {
    return res.status(404).json({
      success: false,
      message: "Address not found",
    });
  }

  // Update the address fields with data from request body
  Object.keys(updateData).forEach((key) => {
    address[key] = updateData[key];
  });

  await userAddress.save();

  return res.status(200).json({
    success: true,
    message: "Address updated successfully",
    address,
  });
});
