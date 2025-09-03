const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReturnProductSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variantId: {
      type: Schema.Types.ObjectId,
      ref: "ProductVarient",
    },
    quantity: { type: Number, required: true, min: 1 },
    reason: { type: String, required: true },
    description: { type: String, default: "" },
    images: [{ type: String }], // Optional - URLs or filenames for return proof
  },
  { _id: false }
);

const ReturnOrderSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: {
      type: [ReturnProductSchema],
      required: true,
    },
    status: {
      type: String,
      enum: [
        "requested",
        "approved",
        "rejected",
        "received",
        "refunded",
        "cancelled",
      ],
      default: "requested",
    },
    refundAmount: { type: Number, default: 0 },
    comment: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.ReturnOrder ||
  mongoose.model("ReturnOrder", ReturnOrderSchema);
