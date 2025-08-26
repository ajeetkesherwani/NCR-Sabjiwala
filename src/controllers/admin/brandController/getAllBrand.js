const Brand = require("../../../models/brand");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllBrand = catchAsync(async (req, res) => {

    const brand = await Brand.find();

    return res.status(200).json({
        status: true,
        results: brand.length,
        data: brand
    })

})