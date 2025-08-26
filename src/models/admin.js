const bcrypt = require('bcrypt');
const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
    image: { type: String, default: "" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNo: { type: String, default: "" },
    password: { type: String, required: true },
    address: { type: String, default: "" },
    bio: { type: String, default: "" },
    isSuperAdmin: { type: Boolean, default: false },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
    isBlocked: { type: Boolean, default: false },
}, {
    timestamps: true
});

// Pre-save middleware to hash the password
adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        this.password = await bcrypt.hash(this.password, 12);
        next();
    } catch (err) {
        next(err);
    }
});

// Method to compare entered password with hashed password
adminSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;