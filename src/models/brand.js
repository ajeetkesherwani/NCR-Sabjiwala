const mongoose = require("mongoose")

const brandSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
   image: {
    type: String,
   },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})


const Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand