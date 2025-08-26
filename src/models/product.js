const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        default: null
    },
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        default: null
    },
    sku: { type: String, default: "" },
    primary_image: {
        type: String,
        required: true
    },
    gallery_image: [{
        type: String,
        required: true
    }],
    name: {
        type: String,
        required: true
    },
    mrp: {
        type: String,
        required: true
    },
    sellingPrice: {
        type: String,
        required: true
    },
    discount: {
        type: String,
        default: 0
    },
    unitOfMeasurement: {
        type: String,
        // enum: ['gram', 'kg', 'pcs'],
        required: true
    },
    sellingUnit: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true
    },
    longDescription: {
        type: String
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    },
    type: {
        type: String
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        default: "67f619471646a8ac19162996"
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Product = mongoose.model("Product", ProductSchema)
module.exports = Product;
