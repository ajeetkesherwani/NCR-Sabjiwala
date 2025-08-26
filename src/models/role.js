// models/roleModel.js
const mongoose = require("mongoose");

const roleSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    // This is an array of references to the permissions this role has.
    // permissions: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Permission"
    // }]
    permissions: [{ type: String }]
}, { timestamps: true });

const Role = mongoose.model("Role", roleSchema);
module.exports = Role;