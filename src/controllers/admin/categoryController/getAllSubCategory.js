const Category = require("../../../models/category");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllSubCategory = catchAsync(async (req, res) => {

    const allSubCategory = await Category.find({ cat_id: { $ne: null } }).populate("cat_id", "name type");

    return res.status(200).json({
        status: true,
        results: allSubCategory.length,
        data: allSubCategory
    })

})