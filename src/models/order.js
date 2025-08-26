const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductDataSchema = new Schema({
    product_id: { type: Schema.Types.ObjectId, ref: 'VendorProduct', required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    toppings: [
        {
            toppingId: { type: Schema.Types.ObjectId, ref: "Toppins", required: true, },
            price: { type: Number, required: true, min: 0, }
        }
    ],
    finalPrice: { type: Number, required: true }
}, { _id: false });

const OrderSchema = new Schema({
    booking_id: { type: String, required: true, unique: true },
    shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    productData: { type: ProductDataSchema, required: true, },
    itemTotal: { type: Number, required: true },
    couponId: { type: Schema.Types.ObjectId, ref: 'Coupon', default: null },
    couponCode: { type: String, default: "" },
    couponAmount: { type: Number, default: 0 },
    afterCouponAmount: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    addressId: { type: Schema.Types.ObjectId, ref: 'Address', required: true },
    deliveryDate: { type: Date, required: true },
    deliveryTime: { type: String, required: true },
    deliveryCharge: { type: Number, default: 0 },
    packingCharge: { type: Number, default: 0 },
    commissionRate: { type: Number, required: true },
    commissionAmount: { type: Number, required: true },
    finalTotalPrice: { type: Number, required: true },
    orderStatus: { type: String, enum: ['pending', 'accepted', 'preparing', 'ready', 'shipped', 'running', 'out of delivery', 'delivered', 'cancelled'], default: 'pending' },
    preparationTime: { type: Number, default: null },
    preparationStartedAt: { type: Date, default: null },
    readyAt: { type: Date, default: null },
    paymentMode: { type: String, enum: ['cash', 'card', 'upi', 'wallet', 'cod', 'online'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    paymentId: { type: String, default: null },
    assignedDriver: { type: Schema.Types.ObjectId, ref: 'Driver', default: null },
    razorpayOrderId: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
