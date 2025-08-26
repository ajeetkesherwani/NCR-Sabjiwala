// models/permissionModel.js
const mongoose = require("mongoose");

// It's good practice to have a clear, unique name for each permission.
// e.g., 'MANAGE_ORDERS', 'VIEW_VENDORS', 'MANAGE_BANNERS'
const permissionSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    }
}, { timestamps: true });

const Permission = mongoose.model("Permission", permissionSchema);
module.exports = Permission;