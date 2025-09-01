const Category = require("../../../models/category");
const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/AppError");

exports.getAllSubCategory = catchAsync(async (req, res, next) => {
    const { categoryId } = req.query;

    // === Build filter condition ===
    let filter = {};
    if (categoryId) {
        filter.cat_id = categoryId;
    } else {
        filter.cat_id = { $ne: null }; // fetch only subcategories
    }

    // === Fetch subcategories with parent category populated ===
    const subCategories = await Category.find(filter).populate("cat_id", "name type");

    // === Return response ===
    return res.status(200).json({
        status: true,
        message: "Subcategories fetched successfully",
        results: subCategories.length,
        data: subCategories
    });
});
