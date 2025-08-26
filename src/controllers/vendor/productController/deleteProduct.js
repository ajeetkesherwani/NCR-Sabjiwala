const Product = require("../../../models/product");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.deleteProduct = catchAsync(async (req, res, next) => {
    const id = req.params.id;

    const product = await Product.findById(id);

    if (!product) {
        return next(new AppError("Product not found", 404));
    }

    try {
        // if (product.images) {
        //     await deleteOldFiles(product.images);
        //     await Promise.all(product.images.map(file => deleteOldFiles(file)));
        // }

        await Product.findByIdAndDelete(id);

        res.status(200).json({
            status: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        return next(error);
    }
});