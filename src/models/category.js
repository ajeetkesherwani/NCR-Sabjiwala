const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        default: ""
    },
    cat_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: null
    },
    sortOrder: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    }
}, {
    timestamps: true
});

// Auto-increment sortOrder for new categories or subcategories
categorySchema.pre("save", async function (next) {
    if (!this.isNew || this.sortOrder > 0) return next();
    try {
        const filter = this.cat_id ? { cat_id: this.cat_id } : { cat_id: null };
        const maxItem = await mongoose.model("Category").findOne(filter).sort({ sortOrder: -1 }).select("sortOrder");

        this.sortOrder = (maxItem?.sortOrder || 0) + 1;
        next();
    } catch (err) {
        next(err);
    }
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
