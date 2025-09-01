const Category = require("../../../models/category");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.updateCategoryStatus = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    // ✅ Validate status input
    if (status !== "active" && status !== "inactive") {
        return next(new AppError("Invalid status value. Must be 'active' or 'inactive'.", 400));
    }

    const category = await Category.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    );

    if (!category) return next(new AppError("Category not found", 404));

    return res.status(200).json({
        status: true,
        message: "Category status updated successfully",
        data: { category },
    });
});
