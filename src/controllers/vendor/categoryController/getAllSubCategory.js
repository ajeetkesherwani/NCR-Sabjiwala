const Category = require("../../../models/category");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllSubCategory = catchAsync(async (req, res, next) => {
    let { cat_id } = req.query;
    
    let allSubCategory;
    if (cat_id) {
        allSubCategory = await Category.find({ cat_id: cat_id, status: "active" });
    } else {
        allSubCategory = await Category.find({ cat_id: { $ne: null }, status: "active" })
    }

    // console.log(allSubCategory)

    res.status(200).json({
        status: "success",
        results: allSubCategory.length,
        data: allSubCategory
    });
})