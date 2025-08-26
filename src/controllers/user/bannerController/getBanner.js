const banner = require("../../../models/banner");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllBanners = catchAsync(async (req, res) => {

    const serviceId = req.query.serviceId;

    const banners = await banner.find().select("image").sort({ createdAt: -1 }); 

    return res.status(200).json({
        status: true,
        message: "Banners fetched successfully",
        data: banners
    });
});
