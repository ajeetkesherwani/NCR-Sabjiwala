const Category = require("../../../models/category");
const catchAsync = require("../../../utils/catchAsync");

exports.getSubCategory = catchAsync(async (req, res) => {

    let id = req.params.id

    const subCategory = await Category.find({ cat_id: id });

    return res.status(200).json({
        status: true,
        results: subCategory.length,
        data: subCategory
    })

})