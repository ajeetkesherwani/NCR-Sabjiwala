const path = require("path");
const Category = require("../../../models/category");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.deleteCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // === Validate ID and check if category exists ===
    const category = await Category.findById(id);
    if (!category) {
        return next(new AppError("Category not found", 404));
    }

    // === Optionally delete associated image file ===
    // if (category.image) {
    //     await deleteOldFiles(category.image);
    // }

    // === Delete category from DB ===
    await Category.findByIdAndDelete(id);

    // === Return success response ===
    return res.status(200).json({
        status: true,
        message: "Category deleted successfully",
        data: category
    });
});
