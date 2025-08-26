const cms = require("../../../models/cms");
const catchAsync = require("../../../utils/catchAsync");


exports.getCms = catchAsync(async (req, res) => {

    try {
        const type = "vendor";
        const cmsData = await cms.findOne({ type });
        return res.status(200).json({
            status: true,
            message: "CMS Data found",
            cmsData
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Something went wrong", error: error.message });
    }

})