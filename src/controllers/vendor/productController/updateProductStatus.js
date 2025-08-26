const Product = require("../../../models/product");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.updateProductStatus = catchAsync(async (req, res, next) => {
    const { id, status } = req.body;

    if (!id || !status) {
        return next(new AppError("Product ID and status are required.", 400));
    }

    if (!["active", "inactive"].includes(status)) {
        return next(new AppError("Invalid status. Use 'active' or 'inactive'.", 400));
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    );

    if (!updatedProduct) {
        return next(new AppError("Product not found.", 404));
    }

    res.status(200).json({
        status: true,
        message: "Product status updated successfully.",
        data: updatedProduct,
    });
});
