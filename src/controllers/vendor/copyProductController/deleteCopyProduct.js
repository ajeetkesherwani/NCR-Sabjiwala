const Product = require("../../../models/product");
const VendorProduct = require("../../../models/vendorProduct");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.deleteCopyProduct = catchAsync(async (req, res, next) => {
    const id = req.params.id;

    const product = await VendorProduct.findById(id);

    if (!product) {
        return next(new AppError("Product not found", 404));
    }

    try {

        await VendorProduct.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

        res.status(200).json({
            status: true,
            message: "Product deleted successfully",
            data: product
        });
    } catch (error) {
        return next(error);
    }
});