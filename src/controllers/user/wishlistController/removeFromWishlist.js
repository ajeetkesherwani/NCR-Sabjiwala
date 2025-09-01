const mongoose = require("mongoose");
const Wishlist = require("../../../models/wishlist");
const catchAsync = require("../../../utils/catchAsync");

exports.removeFromWishlist = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.productId;

  let wishlist = await Wishlist.findOne({ userId });

  if (!wishlist) {
    return res.status(400).json({
      success: false,
      message: "Wishlist not found",
    });
  }

  const productIdObj = new mongoose.Types.ObjectId(productId); // convert to ObjectId

  wishlist.products.pull({ productId: productIdObj });

  await wishlist.save();

  return res.status(200).json({
    success: true,
    message: "Product removed from wishlist successfully",
    wishlist,
  });
});
