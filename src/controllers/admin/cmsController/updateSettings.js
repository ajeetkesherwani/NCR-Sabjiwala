const Setting = require("../../../models/settings");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.updateSettings = catchAsync(async (req, res, next) => {
    try {

        let { brandName, commission, gst, onboardingFee, email, mobile, address, agreement, termAndConditions, privacyPolicy, refundPolicy } = req.body
        const { id } = req.params;

        const setting = await Setting.findOne({ _id: id });
        if (!setting) return next(new AppError("Setting not found", 404));

        let logo = setting.logo

        if (req.files && req.files.image) {
            const url = `${req.files.image[0].destination}/${req.files.image[0].filename}`;
            logo = url;
        } else {
            logo = setting.logo;
        }

        setting.brandName = brandName || setting.brandName
        setting.logo = logo || setting.logo
        setting.commission = commission || setting.commission
        setting.gst = gst || setting.gst
        setting.onboardingFee = onboardingFee || setting.onboardingFee
        setting.email = email || setting.email
        setting.mobile = mobile || setting.mobile
        setting.address = address || setting.address
        setting.agreement = agreement || setting.agreement
        setting.termAndConditions = termAndConditions || setting.termAndConditions
        setting.privacyPolicy = privacyPolicy || setting.privacyPolicy
        setting.refundPolicy = refundPolicy || setting.refundPolicy
        await setting.save()

        return res.status(201).json({
            status: true,
            message: "Setting Updated",
            data: { setting }
        })

    } catch (error) {
        return res.status(500).json({ status: false, message: "Something went wrong", error: error.message });
    }
})