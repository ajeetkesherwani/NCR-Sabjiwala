const Setting = require("../../../models/settings");
const catchAsync = require("../../../utils/catchAsync");

exports.addSettings = catchAsync(async (req, res) => {
    try {

        let { brandName, commission, gst, onboardingFee, agreement, email, mobile, address, termAndConditions, privacyPolicy, refundPolicy} = req.body

        // if(!type || type === "") {
        //     return res.status(400).json({
        //         status: false,
        //         message: "Type is required",
        //     });
        // }

        let logo;
        if (req.files && req.files.image) {
            const url = `${req.files.image[0].destination}/${req.files.image[0].filename}`;
            logo = url;
        } else {
            logo = "";
        }

        const setting = new Setting({ brandName, logo, commission, gst, onboardingFee, email, mobile, address, agreement, termAndConditions, privacyPolicy, refundPolicy })
        await setting.save()

        return res.status(201).json({
            status: true,
            message: "Setting Added",
            data: { setting }
        })

    } catch (error) {
        return res.status(500).json({ status: false, message: "Something went wrong", error: error.message });
    }
})