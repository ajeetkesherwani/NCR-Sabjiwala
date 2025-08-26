const Product = require("../../../models/product");
const VendorProduct = require("../../../models/vendorProduct");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.updateCopyProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let { name, categoryId, subCategoryId, brandId, mrp, sellingPrice, discount, unitOfMeasurement, sellingUnit, shortDescription, longDescription, vendorSellingPrice } = req.body;

    const product = await VendorProduct.findById(id);
    if (!product) return next(new AppError("Product not found", 404));

    // Update other fields.
    product.name = name || product.name;
    product.vendorSellingPrice = vendorSellingPrice || product.vendorSellingPrice
    product.categoryId = categoryId || product.categoryId;
    product.subCategoryId = subCategoryId || product.subCategoryId;
    product.brandId = brandId || product.brandId;
    product.mrp = mrp || product.mrp;
    product.sellingPrice = sellingPrice || product.sellingPrice;
    product.discount = discount || product.discount;
    product.unitOfMeasurement = unitOfMeasurement || product.unitOfMeasurement;
    product.sellingUnit = sellingUnit || product.sellingUnit;
    product.shortDescription = shortDescription || product.shortDescription;
    product.longDescription = longDescription || product.longDescription;

    await product.save();

    return res.status(200).json({
        status: true,
        message: "Product updated successfully.",
        data: { product },
    });
});
