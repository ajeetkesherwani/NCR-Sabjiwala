const mongoose = require("mongoose");
const { Schema } = mongoose;

const CartItemSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: "VendorProduct", required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    toppings: [
        {
            toppingId: { type: Schema.Types.ObjectId, ref: "Toppins", required: true },
            price: { type: Number, required: true, min: 0 }
        }
    ],
    finalPrice: { type: Number, required: true, min: 0 }
}, { _id: false });

const ShopCartSchema = new Schema({
    shopId: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
    items: [CartItemSchema]
}, { _id: false });

const CartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    serviceType: { type: String, enum: ["food", "grocery"], default: "food" },
    shops: [ShopCartSchema],
    status: {
        type: String,
        enum: ["active", "ordered", "abandoned"],
        default: "active"
    }
}, { timestamps: true });

module.exports = mongoose.model("newCart", CartSchema);
