const cms = require("../../../models/cms");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.updateCms = catchAsync(async (req, res, next) => {
    try {

        let { agreement, termAndConditions, privacyPolicy, refundPolicy, aboutUs } = req.body
        const { id } = req.params;

        const newcms = await cms.findOne({ _id: id });
        if (!newcms) return next(new AppError("Cms not found", 404));

        newcms.agreement = agreement || newcms.agreement
        newcms.termAndConditions = termAndConditions || newcms.termAndConditions
        newcms.privacyPolicy = privacyPolicy || newcms.privacyPolicy
        newcms.refundPolicy = refundPolicy || newcms.refundPolicy
        newcms.aboutUs = aboutUs || newcms.aboutUs
        await newcms.save()

        return res.status(201).json({
            status: true,
            message: "CMS Updated",
            cmsData: newcms
        })

    } catch (error) {
        return res.status(500).json({ status: false, message: "Something went wrong", error: error.message });
    }
})