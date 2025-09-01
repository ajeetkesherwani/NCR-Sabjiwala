const path = require("path");
const Category = require("../../../models/category");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.createCategory = catchAsync(async (req, res, next) => {
    const { name, cat_id } = req.body;

    // === Validate category name ===
    if (!name || !name.trim()) {
        return next(new AppError("Name is required", 400));
    }

    // === Handle image upload ===
    let imagePath = "";
    if (req.files && req.files.image && req.files.image.length > 0) {
        const file = req.files.image[0];
        imagePath = path.join(file.destination, file.filename).replace(/\\/g, "/");
    }

    // === Create Category or Subcategory ===
    const categoryData = {
        name: name.trim(),
        image: imagePath
    };

    if (cat_id) {
        categoryData.cat_id = cat_id;
    }

    const category = new Category(categoryData);
    await category.save();

    // === Send response ===
    return res.status(201).json({
        status: true,
        message: cat_id
            ? "Subcategory added successfully"
            : "Category added successfully",
        data: { category }
    });
});
