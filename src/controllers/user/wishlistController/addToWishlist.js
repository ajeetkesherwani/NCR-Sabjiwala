const Wishlist = require("../../../models/wishlist");
const catchAsync = require("../../../utils/catchAsync");

exports.addToWishlist = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({
      success: false,
      message: "Product ID is required",
    });
  }

  let wishlist = await Wishlist.findOne({ userId });

  if (!wishlist) {
    wishlist = new Wishlist({ userId, products: [] });
  }

  // Prevent duplicate product IDs
  const alreadyExists = wishlist.products.some(
    (item) => item.productId.toString() === productId
  );

  if (alreadyExists) {
    return res.status(400).json({
      success: false,
      message: "Product already in wishlist",
    });
  }

  wishlist.products.push({ productId });

  await wishlist.save();

  return res.status(201).json({
    success: true,
    message: "Product added to wishlist",
    wishlist,
  });
});
