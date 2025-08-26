const banner = require("../../../models/banner");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllBanners = catchAsync(async (req, res) => {
    const banners = await banner.find().populate("serviceId").sort({ createdAt: -1 }); // newest first

    return res.status(200).json({
        status: true,
        message: "Banners fetched successfully",
        data: banners
    });
});
