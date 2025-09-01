const Cart = require("../../../models/cart");
const UserAddress = require("../../../models/address");
const Order = require("../../../models/order");
const catchAsync = require("../../../utils/catchAsync");

exports.createOrder = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { addressId, paymentMethod, couponCode, discountAmount, remark } =
    req.body;

  if (!addressId) {
    return res
      .status(400)
      .json({ success: false, message: "Address ID is required" });
  }

  // Fetch user's cart
  const cart = await Cart.findOne({ userId })
    .populate("products.productId")
    .populate("products.variantId");

  if (!cart || cart.products.length === 0) {
    return res.status(400).json({ success: false, message: "Cart is empty" });
  }

  // Fetch user's address document
  const userAddress = await UserAddress.findOne({ userId });
  if (!userAddress) {
    return res
      .status(404)
      .json({ success: false, message: "User address document not found" });
  }

  const address = userAddress.addresses.id(addressId);
  if (!address) {
    return res
      .status(404)
      .json({ success: false, message: "Address not found" });
  }

  // Calculate totals
  let itemPriceTotal = 0;
  cart.products.forEach((prod) => {
    const price = prod.variantId?.price ?? prod.productId?.price ?? 0;
    const qty = prod.quantity ?? 1;
    itemPriceTotal += price * qty;
  });

  const handlingCharge = 50;
  const deliveryCharge = 100;

  // Calculate grand total considering discount
  let grandTotal = itemPriceTotal + handlingCharge + deliveryCharge;
  if (discountAmount) {
    grandTotal -= discountAmount;
    if (grandTotal < 0) grandTotal = 0;
  }

  // Create order data
  const newOrder = new Order({
    userId,
    products: cart.products.map((prod) => ({
      productId: prod.productId._id,
      variantId: prod.variantId?._id,
      quantity: prod.quantity,
      price: prod.variantId?.price ?? prod.productId?.price,
    })),
    shippingAddress: address.toObject(),
    paymentMethod,
    itemPriceTotal,
    handlingCharge,
    deliveryCharge,
    grandTotal,
    status: "pending",
    remark,
    couponUsage: couponCode
      ? [
          {
            couponCode,
            discountAmount: discountAmount || 0,
          },
        ]
      : [],
  });

  await newOrder.save();

  // Clear cart after order is placed
  cart.products = [];
  await cart.save();

  return res.status(201).json({
    success: true,
    message: "Order placed successfully",
    order: newOrder,
  });
});
