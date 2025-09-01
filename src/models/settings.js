const mongoose = require("mongoose");
const razorpay = require("../utils/razorpayInstance");

const settingSchema = mongoose.Schema({
    // type: { type: String, default: "" },
    brandName: { type: String, default: "" },
    logo: { type: String, default: "" },
    commission: { type: String, default: "" },
    gst: { type: String, default: "" },
    onboardingFee: { type: String, default: "" },
    plateformFee: { type: String, default: "" },
    finialPlateformFee: { type: String, default: "" },
    email: { type: String, default: "" },
    mobile: { type: String, default: "" },
    address: { type: String, default: "" },
    googleMapApiKey: { type: String, default: "" },
    razorpayKeyId: { type: String, default: "" },
    razorpayKeySecret: { type: String, default: "" },
    agreement: { type: String, default: "" },
    termAndConditions: { type: String, default: "" },
    privacyPolicy: { type: String, default: "" },
    refundPolicy: { type: String, default: "" },
})

const Setting = mongoose.model("setting", settingSchema)
module.exports = Setting;