const Setting = require("../../../models/settings");
const catchAsync = require("../../../utils/catchAsync");

exports.getFee = catchAsync(async (req, res, next) => {
    let commission, gst, onbording;

    const setting = await Setting.findOne();
    commission = setting.commission;
    gst = setting.gst
    onbording = setting.onboardingFee

    return res.status(200).json({
        success: true,
        message: "Go Rabbit Fee fetched successfully.",
        data: { commission, gst, onbording },
    });
})