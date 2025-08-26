const mongoose = require("mongoose")

const vendorAccountSchema = mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: true
    },
    bankName: {
        type: String,
        default: ""
    },
    accountNo: {
        type: String,
        default: ""
    },
    ifsc: {
        type: String,
        default: ""
    },
    branchName: {
        type: String,
        default: ""
    },
    benificiaryName: { type: String, default: '' },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const VendorAccount = mongoose.model("vendorAccount", vendorAccountSchema)
module.exports = VendorAccount