const mongoose = require("mongoose");
const { Schema } = mongoose;

const CartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: "VendorProduct",
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
    // array of topping IDs + their individual price
    toppings: [
        {
            toppingId: {
                type: Schema.Types.ObjectId,
                ref: "Toppins",
                required: true,
            },
            price: {
                type: Number,
                required: true,
                min: 0,
            }
        }
    ],
    finalPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ["active", "ordered", "abandoned"],
        default: "active",
    }
}, { timestamps: true });
// compute finalPrice before save: (price + sum(topping prices)) * quantity
CartSchema.pre("validate", function (next) {
    const toppingsCost = this.toppings.reduce((sum, t) => sum + t.price, 0);
    this.finalPrice = (this.price + toppingsCost) * this.quantity;
    next();
});

module.exports = mongoose.model("Cart", CartSchema);
