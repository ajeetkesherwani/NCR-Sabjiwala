const mongoose = require("mongoose");

const vendorOrderHistorySchema = new mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Order"
    },
    vendor_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Vendor"
    },
    booking_id: {
        type: String,
        required: true
    },
    products: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "Product"
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    order_status: {
        type: String,
        enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const VendorOrderHistory = mongoose.model("VendorOrderHistory", vendorOrderHistorySchema);
module.exports = VendorOrderHistory;
