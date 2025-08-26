const mongoose = require("mongoose");

const serviceableAreasSchema = mongoose.Schema({
    pincode: { type: String, required: true, unique: true },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    isFoodAvailable: { type: Boolean, default: false },
    isGroceryAvailable: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });


const serviceableAreas = mongoose.model("serviceableAreas", serviceableAreasSchema);
module.exports = serviceableAreas