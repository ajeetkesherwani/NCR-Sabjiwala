const DealsBanner = require("../../../models/dealBanner");
const AppError = require("../../../utils/AppError");

exports.getDealsBannerDetail = (async(req, res) => {

    const id = req.params.id;
    if(!id) return next(new AppError("id is required",400));

    const dealsDetail = await DealsBanner.findById(id);

    if(!dealsDetail) return next(new AppError("dealsBanner not found",404));

    return res.status(200).json({
        status: true,
        message: "Deals Banner Details",
        data: dealsDetail
    });
});