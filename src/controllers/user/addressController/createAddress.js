const { default: axios } = require("axios");
const UserAddress = require("../../../models/address");
const catchAsync = require("../../../utils/catchAsync");

exports.createAddress = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const {
    addressType,
    floor,
    houseNoOrFlatNo,
    landmark,
    pincode,
    city,
    receiverName,
    receiverNo,
  } = req.body;

  if (
    !addressType ||
    !houseNoOrFlatNo ||
    !pincode ||
    !city ||
    !receiverName ||
    !receiverNo
  ) {
    return res.status(400).json({
      success: false,
      message: "Required fields are missing",
    });
  }

  let userAddress = await UserAddress.findOne({ userId });

  if (!userAddress) {
    userAddress = new UserAddress({ userId, addresses: [] });
  }

  userAddress.addresses.push({
    addressType,
    floor,
    houseNoOrFlatNo,
    landmark,
    pincode,
    city,
    receiverName,
    receiverNo,
  });

  await userAddress.save();

  return res.status(201).json({
    success: true,
    message: "Address added successfully",
    address: userAddress.addresses[userAddress.addresses.length - 1],
  });
});
