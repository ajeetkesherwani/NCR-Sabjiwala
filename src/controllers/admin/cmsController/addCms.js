const cms = require("../../../models/cms");
const Setting = require("../../../models/settings");
const catchAsync = require("../../../utils/catchAsync");

exports.addCms = catchAsync(async (req, res) => {
    try {

        let { agreement, termAndConditions, privacyPolicy, refundPolicy, type} = req.body

        if(!type || type === "") {
            return res.status(400).json({
                status: false,
                message: "Type is required",
            });
        }

        const newCms = new cms({ agreement, termAndConditions, privacyPolicy, refundPolicy, type })
        await newCms.save()

        return res.status(201).json({
            status: true,
            message: "CMS Added",
            data: { newCms }
        })

    } catch (error) {
        return res.status(500).json({ status: false, message: "Something went wrong", error: error.message });
    }
})