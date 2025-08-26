const mongoose = require("mongoose");

const toppinsSchema = mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "VendorProduct" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    createdAt: { type: Date, default: Date.now },
})

const Toppins = mongoose.model("Toppins", toppinsSchema);
module.exports = Toppins;