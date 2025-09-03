const ReturnOrder = require("../../../models/returnOrder");
const Order = require("../../../models/order");
const catchAsync = require("../../../utils/catchAsync");

exports.returnOrder = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { orderId, products, comment } = req.body;

  // Validate order exists and belongs to user
  const order = await Order.findOne({ _id: orderId, userId });
  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found or does not belong to user.",
    });
  }

  // Validate products array
  if (!Array.isArray(products) || products.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Products array is required." });
  }

  // Optional: Validate each product in products array belongs to original order.products

  const newReturnOrder = new ReturnOrder({
    orderId,
    userId,
    products,
    comment: comment || "",
  });

  await newReturnOrder.save();

  return res.status(201).json({
    success: true,
    message: "Return request created successfully.",
    returnOrder: newReturnOrder,
  });
});
