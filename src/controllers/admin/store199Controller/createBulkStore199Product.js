const store199Product = require("../../../models/store199Product");
const VendorProduct = require("../../../models/vendorProduct");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.createBulkStore199Product = catchAsync(async (req, res, next) => {
    try {
        const { productIds } = req.body; 
        if (!Array.isArray(productIds) || productIds.length === 0) {
            return next(new AppError("No products selected", 400));
        }

        const products = await VendorProduct.find({ _id: { $in: productIds }, isDeleted: false });

        if (products.length === 0) {
            return next(new AppError("No matching products found", 404));
        }

        const bulkDocs = products.map((product) => ({
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
            vendorSellingPrice: product.vendorSellingPrice < 200 ? product.vendorSellingPrice : 199,
            unitOfMeasurement: product.unitOfMeasurement,
            sellingUnit: product.sellingUnit,
            shortDescription: product.shortDescription,
            longDescription: product.longDescription,
        }));

        await store199Product.insertMany(bulkDocs);

        return res.status(201).json({ message: `${bulkDocs.length} products added to 199 store.` });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
});
