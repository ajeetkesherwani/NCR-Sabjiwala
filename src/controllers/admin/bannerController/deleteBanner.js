const banner = require("../../../models/banner");
const catchAsync = require("../../../utils/catchAsync");

exports.deleteBanner = catchAsync(async (req, res) => {
    let id = req.params.id

    const bannerData = await banner.findById(id);
    // await deleteOldFiles(category.image)
    await banner.findByIdAndDelete(id)


    return res.status(200).json({
        status: true,
        message: "Banner deleted successfully",
        data: bannerData
    })

})