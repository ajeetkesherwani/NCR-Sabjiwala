const mongoose = require("mongoose");

const couponUsageSchema = new mongoose.Schema({
  couponCode: { type: String, required: true },
  discountAmount: { type: Number, required: true },
  usedAt: { type: Date, default: Date.now },
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        variantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ProductVarient",
        },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      addressType: { type: String, required: true },
      floor: { type: String },
      houseNoOrFlatNo: { type: String, required: true },
      landmark: { type: String },
      pincode: { type: String, required: true },
      city: { type: String, required: true },
      receiverName: { type: String, required: true },
      receiverNo: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "card", "netbanking", "upi", "online"],
      required: true,
    },
    itemPriceTotal: { type: Number, required: true },
    handlingCharge: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    remark: { type: String }, // Any remarks like "First time use" or "Applied during sale"
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    couponUsage: [couponUsageSchema], // Array to track coupon usage in this order
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
