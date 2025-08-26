const Product = require("../../../models/product");
const store199Product = require("../../../models/store199Product");
const VendorProduct = require("../../../models/vendorProduct");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.deleteStore199Product = catchAsync(async (req, res, next) => {
    const id = req.params.id;

    const product = await store199Product.findById(id);

    if (!product) {
        return next(new AppError("Product not found", 404));
    }

    try {

        await store199Product.findByIdAndDelete(id);

        res.status(200).json({
            status: true,
            message: "Product deleted successfully",
            data: product
        });
    } catch (error) {
        return next(error);
    }
});