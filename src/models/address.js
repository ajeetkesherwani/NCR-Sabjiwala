const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, default: "Home" },
    address1: { type: String, required: true },
    address2: { type: String },
    city: { type: String, required: true },
    pincode: { type: Number, required: true },
    state: { type: String, required: true },
    personName: { type: String, default: "" },
    personMob: { type: String, default: "" },
    isDefault: { type: Boolean, default: "true" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number] } // [long, lat]
    },
    createdAt: { type: Date, default: Date.now },
})

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;