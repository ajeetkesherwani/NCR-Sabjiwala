const store199Product = require("../../../models/store199Product");
const VendorProduct = require("../../../models/vendorProduct");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.createStore199Product = catchAsync(async (req, res, next) => {

    try {

        let { productId } = req.body

        const product = await VendorProduct.findById(productId);
        if (!product) return next(new AppError("No product found.", 400));

        const newProduct = new store199Product({
            vendorId: product.vendorId,
            shopId: product.shopId,
            productId: product._id,
            categoryId: product.categoryId,
            subCategoryId: product.subCategoryId,
            brandId: product.brandId,
            sku: product.sku,
            type: product.type,
            primary_image: product.primary_image,
            gallery_image: product.gallery_image,
            name: product.name,
            mrp: product.mrp,
            vendorSellingPrice: product.vendorSellingPrice < 200 ? product.vendorSellingPrice : 199, // set to 199 if vendorSellingPrice is greater than 200
            unitOfMeasurement: product.unitOfMeasurement,
            sellingUnit: product.sellingUnit,
            shortDescription: product.shortDescription,
            longDescription: product.longDescription,
        })

        await newProduct.save();

        return res.status(201).json({ message: "199 product added successfully", newProduct });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }

})
