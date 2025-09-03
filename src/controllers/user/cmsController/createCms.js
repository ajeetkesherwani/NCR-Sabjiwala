const Cms = require("../../../models/cms");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.createCms = catchAsync(async(req, res) => {

    try {

        const { privacyPolicy, termAndConditions, aboutUs  } = req.body;
        
        if(!privacyPolicy || !termAndConditions || !aboutUs){
            throw new AppError("privacyPolicy, termsAndConditions and aboutUs is required");
        }

        const cms = await Cms.create({ privacyPolicy, termAndConditions, aboutUs });


        return res.status("200").json({ 
            success: true, 
            message: "Cms page created successfully", 
            data: cms
        });
        
    } catch (error) {
        return res.status("500").json({ success: true, message: error.message });
    }

});