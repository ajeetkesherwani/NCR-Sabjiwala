const UserAddress = require("../../../models/address");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.deleteAddress = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const addressId = req.params.addressId;

  if (!addressId) {
    return res.status(400).json({
      success: false,
      message: "Address ID is required",
    });
  }

  const userAddress = await UserAddress.findOne({ userId });

  if (!userAddress) {
    return res.status(404).json({
      success: false,
      message: "User address document not found",
    });
  }

  // Use pull method to remove subdocument by _id
  const addressToRemove = userAddress.addresses.id(addressId);
  if (!addressToRemove) {
    return res.status(404).json({
      success: false,
      message: "Address not found",
    });
  }

  // Use the parent array's pull method to remove subdocument by _id
  userAddress.addresses.pull(addressToRemove._id);

  await userAddress.save();

  return res.status(200).json({
    success: true,
    message: "Address deleted successfully",
  });
});
