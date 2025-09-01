const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  images: [{ type: String }], // array of image URLs
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  variants: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProductVarient" }],
  details: {
    nutrientValue: { type: String, default: "" },
    about: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  info: {
    shelfLife: { type: String, default: "" },
    returnPolicy: { type: String, default: "" },
    storageTips: { type: String, default: "" },
    country: { type: String, default: "" },
    help: { type: String, default: "" },
    disclaimer: { type: String, default: "" },
    seller: { type: String, default: "" },
    fssai: { type: String, default: "" },
  },
  price: { type: Number }, // base price
  mrp: { type: Number }, // maximum retail price
  rating: { type: Number, default: 0 }, // average rating
  isAvailable: { type: Boolean, default: true },
  isDealOfTheDay: { type: Boolean, default: false },
  isReturnAvailable: { type: Boolean, default: false },
  isFavorite: { type: Boolean, default: false }, // For user app toggle (can be moved to user context)
  tags: [{ type: String }], // for search
  isFeatured: { type: Boolean, default: false },
  isRecommended: { type: Boolean, default: false },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
