// models/Driver.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const driverSchema = new Schema({
    // --- Driver basic details ---
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    mobileNo: { type: String, required: true, unique: true },
    password: { type: String },
    address: String,
    image: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    licenseNumber: { type: String, trim: true },
    otp: { code: String, expiresAt: Date },
    // --- Vehicle basic details ---
    vehicle: {
        type: { type: String, required: true, trim: true },
        model: { type: String, required: true, trim: true },
        registrationNumber: { type: String, required: true, unique: true, trim: true },
        insuranceNumber: { type: String, trim: true }
    },
    // --- Driver documents ---
    vehicleRcImage: { type: String, default: '' },
    insuranceImage: { type: String, default: '' },
    licenseImage: { type: String, default: '' },
    adharImage: { type: String, default: '' },
    // --- commission and wallet details ---
    commission: { type: Number, default: 0 },
    wallet_balance: { type: Number, default: 0 },
    cashCollection: { type: Number, default: 0 },
    isBlocked: { type: Boolean, default: false },
    // for firebase cloud messaging
    deviceId: { type: String, required: true },
    deviceToken: { type: String, required: true },
    // current order assigned to driver
    currentOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
    // Add inside driverSchema (anywhere before closing the schema)
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
