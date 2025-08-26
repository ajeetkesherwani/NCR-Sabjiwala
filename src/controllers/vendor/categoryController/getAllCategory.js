const Category = require("../../../models/category");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllCategory = catchAsync(async (req, res, next) => {
    const allCategory = await Category.find({ cat_id: null, status: "active" })

    return res.status(200).json({
        status: "success",
        results: allCategory.length,
        data: allCategory
    });
})