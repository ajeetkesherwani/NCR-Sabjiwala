const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, trim: true },
    discountType: { type: String, enum: ["percentage", "fixed"], required: true },
    discountValue: { type: Number, required: true },
    minOrderAmount: { type: Number, default: 0 },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", default: null },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", default: null },
    usageLimit: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
    singlePersonUsageLimit: { type: Number, default: 1 },
    startDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active", },
    createdAt: { type: Date, default: Date.now },
});

const Coupon = mongoose.model("Coupon", couponSchema)
module.exports = Coupon;
