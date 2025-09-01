const Cart = require("../../../models/cart");
const catchAsync = require("../../../utils/catchAsync");

exports.deleteCart = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { productId, variantId } = req.body;

  if (!productId) {
    return res
      .status(400)
      .json({ success: false, message: "ProductId is required" });
  }

  // Build the filter for the array element to remove
  const productFilter = { productId };
  if (variantId) {
    productFilter.variantId = variantId;
  }

  // Pull only the matching product from user's cart products array
  const updatedCart = await Cart.findOneAndUpdate(
    { userId },
    { $pull: { products: productFilter } },
    { new: true }
  );

  if (!updatedCart) {
    return res.status(404).json({
      success: false,
      message: "Cart not found for this user or product not in cart",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Product removed from cart successfully",
    cart: updatedCart,
  });
});
