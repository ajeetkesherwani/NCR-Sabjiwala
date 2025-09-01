
const Product = require("../../../models/product");
const ProductVarient = require("../../../models/productVarient");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");


exports.getProductVarient = catchAsync(async (req, res, next) => {
    const { productId } = req.params;

    // Check if product exists
    const product = await Product.findById(productId).populate("variants");
    if (!product) return next(new AppError("Product not found.", 404));

    return res.status(200).json({
        status: true,
        message: "Product variants fetched successfully.",
        data: {
            productId: product._id,
            variants,
        },
    });
});
