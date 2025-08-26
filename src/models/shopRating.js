const { mongoose } = require("mongoose");

const shopRatingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "newOrder" },
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
});

const shopRating = mongoose.model("shopRating", shopRatingSchema);
module.exports = shopRating