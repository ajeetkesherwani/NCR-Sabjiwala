const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    name: { type: String },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
    shopType: { type: String, enum: ['veg', 'nonveg', 'both'], default: 'both' },
    shopImage: { type: String, default: '' },
    address: { type: String, default: '' },
    pincode: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    lat: { type: String, default: '' },
    long: { type: String, default: '' },
    description: { type: String, default: '' },
    like: { type: Number, default: 0 },
    follower: { type: Number, default: 0 },
    phone: { type: String, default: '' },
    rating: { type: String, default: '0' },
    galleryImage: [{ type: String }],
    deliveryCharge: { type: Number, default: 0 },
    packingCharge: { type: Number, default: 0 },
    menu: [{ type: String }],
    isClose: { type: Boolean, default: false },
    isNightCafe: { type: Boolean, default: false },
    wallet_balance: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], } // [longitude, latitude]
    },
    priority: { type: Number, default: null },
    createdAt: { type: Date, default: Date.now }
})

shopSchema.index({ location: '2dsphere' });
const Shop = mongoose.model("Shop", shopSchema)
module.exports = Shop;