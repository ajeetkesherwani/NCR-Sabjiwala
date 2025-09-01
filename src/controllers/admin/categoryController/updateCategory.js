const Category = require("../../../models/category");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.updateCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { name, cat_id } = req.body;

    // 🔍 Validate ID
    const category = await Category.findById(id);
    if (!category) {
        return next(new AppError("Category not found", 404));
    }

    // 📸 Handle image update
    if (req.files && req.files.image?.length > 0) {
        const newImagePath = `${req.files.image[0].destination}/${req.files.image[0].filename}`;

        // Delete old image if it exists
        if (category.image) {
            await deleteOldFiles(category.image);
        }

        category.image = newImagePath;
    }

    // 📝 Update fields if provided
    if (name) category.name = name.trim();
    if (cat_id) category.cat_id = cat_id;

    await category.save();

    return res.status(200).json({
        status: true,
        message: "Category updated successfully",
        data: { category },
    });
});
