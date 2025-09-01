const mongoose = require('mongoose');

const productVariantSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true }, // e.g., "500g", "1kg"
    images: [{ type: String }], // array of image URLs
    price: { type: Number, required: true },
    originalPrice: { type: Number }, // For showing discount
    discount: { type: Number, default: 0 }, // percentage discount
    stock: { type: Number, default: 0 },
    unit: { type: String }, // optional, e.g., "gm", "kg", "ltr"
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('ProductVarient', productVariantSchema);