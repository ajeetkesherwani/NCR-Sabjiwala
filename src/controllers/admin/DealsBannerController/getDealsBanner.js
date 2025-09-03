const DealsBanner = require("../../../models/dealBanner");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllDealsBanner = catchAsync(async(req, res) => {

    const getDealsBanner = await DealsBanner.find();
    if(!getDealsBanner){
        return next(new AppError("dealsBanner not found ",404));
    }

    res.status(200).json({
        status: true,
        message: "dealsBanner found successfully",
        count: getDealsBanner.length,
        data: getDealsBanner
    });
});