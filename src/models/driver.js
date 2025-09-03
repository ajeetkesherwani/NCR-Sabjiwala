// models/Driver.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const driverSchema = new Schema({
    // --- Driver basic details ---
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true},
    mobileNo: { type: String, required: true},
    address: String,
    image: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    aadharNumber: { type: String, trim: true },
    adharImage: { type: String, default: '' },
    vehicleType: { type: String, required: true, trim: true },
    vehicleNumber: { type: String, required: true, trim: true },
    rcFrontImage: { type: String, default: '' },
    rcBackImage: { type: String, default: '' },
    dlNumber: { type: String, required: true, trim: true },
    // --- commission and wallet details ---
    commission: { type: Number, default: 0 },
    wallet_balance: { type: Number, default: 0 },
    cashCollection: { type: Number, default: 0 },
    isBlocked: { type: Boolean, default: false },
    isRegistered: { type: Boolean, default: false },
    status: { type: Boolean, default: true }, // available or not
    otp: { code: String, expiresAt: Date },
    // otpExpire: { type: Date },
    // --- Device details ---
    // for firebase cloud messaging
    deviceId: { type: String, required: true },
    deviceToken: { type: String, required: true },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0]
        }
    },
    rating: { type: String, default: '0' }
}, {
    timestamps: true
});

driverSchema.index({ location: '2dsphere' });
const Driver = mongoose.model('Driver', driverSchema);
module.exports = Driver;
