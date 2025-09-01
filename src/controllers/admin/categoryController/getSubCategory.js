const Category = require("../../../models/category");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getSubCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // === Validate category ID ===
    if (!id) {
        return next(new AppError("Category ID is required", 400));
    }

    // === Fetch all subcategories for the given category ===
    const subCategories = await Category.find({ cat_id: id });

    // === Send response ===
    return res.status(200).json({
        status: true,
        message: "Subcategories fetched successfully",
        results: subCategories.length,
        data: subCategories
    });
});
