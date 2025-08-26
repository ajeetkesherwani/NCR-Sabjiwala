const Product = require("../../../models/product");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getProduct = catchAsync(async (req, res, next) => {
    const id = req.params.id

    const product = await Product.findById(id).populate([
        { path: "categoryId" },
        { path: "subCategoryId", model: "Category" },
        { path: "vendorId" },
        { path: "brandId" },
        { path: "serviceId" }
    ]);

    if (!product) {
        return next(new AppError("Product not found", 404));
    }

    res.status(200).json({
        status: "success",
        data: product
    });

})