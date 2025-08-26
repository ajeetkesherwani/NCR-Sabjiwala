// models/ExploreSection.js
const mongoose = require('mongoose');

const exploreSectionSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., Top Products, Great Deals
    exploreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Explore' },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'VendorProduct' }],
}, { timestamps: true });

module.exports = mongoose.model('ExploreSection', exploreSectionSchema);
