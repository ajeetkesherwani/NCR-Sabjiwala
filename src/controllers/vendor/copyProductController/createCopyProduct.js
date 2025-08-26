const Product = require("../../../models/product");
const VendorProduct = require("../../../models/vendorProduct");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.createCopyProduct = catchAsync(async (req, res, next) => {

    try {

        let { productId, shopId, vendorSellingPrice } = req.body
        let vendorId = req.vendor._id

        const product = await Product.findById(productId);
        if (!product) return next(new AppError("No product found.", 400));

        const vendorProduct = new VendorProduct({
            vendorId, shopId, productId,
            categoryId: product.categoryId,
            subCategoryId: product.subCategoryId,
            brandId: product.brandId,
            sku: product.sku,
            type: product.type,
            primary_image: product.primary_image,
            gallery_image: product.gallery_image,
            name: product.name,
            mrp: product.mrp,
            vendorSellingPrice,
            unitOfMeasurement: product.unitOfMeasurement,
            sellingUnit: product.sellingUnit,
            shortDescription: product.shortDescription,
            longDescription: product.longDescription,
        })

        await vendorProduct.save();

        return res.status(201).json({ message: "Vendor product added successfully", vendorProduct });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }

})