const { mongoose } = require("mongoose");

const driverRatingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "newOrder" },
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
});

const driverRating = mongoose.model("driverRating", driverRatingSchema);
module.exports = driverRating