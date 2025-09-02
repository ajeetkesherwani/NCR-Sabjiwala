const Cms = require("../../../models/cms");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getCmsPage = catchAsync(async(req, res) => {

    try {

        const getCms = await Cms.find({});
        if(!getCms) throw new AppError("cms not found",404);

        return res.status("200").json({ success: true, message: "cms found successfully", data: getCms })
        
    } catch (error) {
        return res.status("500").json({ success: true, message: error.message });
    }

});