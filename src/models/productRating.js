const { mongoose } = require("mongoose");

const productRatingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "VendorProduct" },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "newOrder" },
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
});

const productRating = mongoose.model("productRating", productRatingSchema);
module.exports = productRating