const mongoose = require("mongoose");

const cartProductSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductVarient", // or your variant model name
    required: false,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
  price: Number, // Could store price at time of adding to cart
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    required: true,
  },
  products: [cartProductSchema],
  updatedAt: Date,
});

module.exports = mongoose.model("Cart", cartSchema);
