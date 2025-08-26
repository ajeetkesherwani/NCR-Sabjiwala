const mongoose = require("mongoose");

const cmsSchema = mongoose.Schema({
    type: { type: String, default: "" },
    agreement: { type: String, default: "" },
    termAndConditions: { type: String, default: "" },
    privacyPolicy: { type: String, default: "" },
    refundPolicy: { type: String, default: "" },
    aboutUs: { type: String, default: "" },
})

const cms = mongoose.model("cms", cmsSchema)
module.exports = cms;