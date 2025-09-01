const Wishlist = require("../../../models/wishlist");
const catchAsync = require("../../../utils/catchAsync");

exports.getWishlist = catchAsync(async (req, res) => {
  const userId = req.user._id;

  let wishlist = await Wishlist.findOne({ userId });

  return res.status(201).json({
    success: true,
    message: "Wishlist fetched successfully",
    wishlist,
  });
});
