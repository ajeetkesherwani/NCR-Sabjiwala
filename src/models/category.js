const mongoose = require("mongoose");

const category = mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String },
    cat_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", },
    type: { type: String, enum: ["veg", "nonveg"], default: "veg" },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    priority: { type: Number, default: null },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
});

const Category = mongoose.model("Category", category);
module.exports = Category;