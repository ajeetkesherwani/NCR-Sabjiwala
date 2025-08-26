const fs = require("fs");
const path = require("path");
const Product = require("../../../models/product");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

const deleteImageFile = (relativePath) => {
    try {
        const fullPath = path.join(__dirname, "../../../../", relativePath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    } catch (err) {
        console.error("Error deleting file:", err);
    }
};

exports.deleteProduct = catchAsync(async (req, res, next) => {
    const productId  = req.params.id;
    
    if (!productId) {
        return next(new AppError("Product ID is required", 400));
    }

    const product = await Product.findById(productId);

    if (!product) {
        return next(new AppError("Product not found", 404));
    }

    // Delete primary image
    if (product.primary_image) {
        deleteImageFile(product.primary_image);
    }

    // Delete gallery images
    if (product.gallery_image && product.gallery_image.length > 0) {
        product.gallery_image.forEach((imgPath) => {
            deleteImageFile(imgPath);
        });
    }

    // Delete the product from DB
    await Product.findByIdAndDelete(productId);

    return res.status(200).json({
        status: true,
        message: "Product deleted successfully",
    });
});
