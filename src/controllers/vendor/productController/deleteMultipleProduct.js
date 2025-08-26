const Product = require("../../../models/product");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.deleteMultipleProducts = catchAsync(async (req, res, next) => {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
        return next(new AppError("Product IDs are required in an array.", 400));
    }

    const products = await Product.find({ _id: { $in: ids } });

    if (!products.length) {
        return next(new AppError("No products found for the provided IDs.", 404));
    }

    try {
        for (const product of products) {
            // if (product.primary_image) {
            //     await deleteOldFiles(product.primary_image);
            // }

            // if (Array.isArray(product.gallery_image)) {
            //     await Promise.all(product.gallery_image.map(file => deleteOldFiles(file)));
            // }

            await Product.findByIdAndDelete(product._id);
        }

        res.status(200).json({
            status: true,
            message: "Selected products deleted successfully.",
        });
    } catch (error) {
        return next(error);
    }
});
