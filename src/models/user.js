
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, trim: true },
    mobileNo: { type: String, required: [true, 'Mobile number is required'], unique: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    profileImage: { type: String, default: '' },
    userType: { type: String, enum: ['veg', 'nonveg'], default: 'veg' },
    serviceType: { type: String, enum: ['food', 'grocery'], default: 'food' },
    status: { type: Boolean, default: true },
    otp: { code: String, expiresAt: Date },
    lastLogin: { type: Date },
    isVerified: { type: Boolean, default: false },
    lat: { type: String, default: '' },
    long: { type: String, default: '' },
    // deviceInfo: { deviceId: String, deviceModel: String, osVersion: String },
    isNewUser: { type: Boolean, default: true },
    // ✅ New GeoJSON location field
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
    },
<<<<<<< HEAD

    wallet: { type: Number, default: 0, min: 0 },
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', sparse: true, default: null },
=======
    wallet: { type: Number, default: 0 },
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', sparse: true, default: null },
    referredByCodeUse: { type: Boolean, default: false },
    deviceId: { type: String, default: '' },
    deviceToken: { type: String, default: '' },
>>>>>>> 506cc98bccb177dbb020d33ce27de1504c36e82b
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);
module.exports = User;