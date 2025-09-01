const catchAsync = require("../../../utils/catchAsync");
const Cart = require("../../../models/cart");

exports.getCart = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ userId })
    .populate({
      path: "products.productId",
      select: "name mrp price images description",
    })
    .populate({
      path: "products.variantId",
      select: "name price stock",
    })
    .lean();

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: "Cart not found for this user",
      cart: null,
    });
  }

  let itemMrpTotal = 0;
  let itemPriceTotal = 0;

  for (const prod of cart.products) {
    const quantity = prod.quantity || 1;
    const productMrp = prod.productId?.mrp || 0;
    // Use variant price if available, else product price
    const productPrice = prod.variantId?.price ?? prod.productId?.price ?? 0;

    itemMrpTotal += productMrp * quantity;
    itemPriceTotal += productPrice * quantity;
  }

  // Example fixed charges - you can modify as per your logic
  const handlingCharge = 20;
  const deliveryCharge = 50;

  const grandTotal = itemPriceTotal + handlingCharge + deliveryCharge;

  return res.status(200).json({
    success: true,
    message: "Cart retrieved successfully",
    cart,
    itemMrpTotal,
    itemPriceTotal,
    handlingCharge,
    deliveryCharge,
    grandTotal,
  });
});
