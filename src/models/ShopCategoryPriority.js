const mongoose = require('mongoose');

const ShopCategoryPrioritySchema = mongoose.Schema({
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    priority: { type: Number, required: true } // e.g., 1 to 5
}, { timestamps: true });

ShopCategoryPrioritySchema.index({ categoryId: 1, priority: 1 });

module.exports = mongoose.model('ShopCategoryPriority', ShopCategoryPrioritySchema);