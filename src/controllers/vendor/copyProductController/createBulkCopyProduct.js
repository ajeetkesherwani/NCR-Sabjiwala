const Product = require("../../../models/product");
const VendorProduct = require("../../../models/vendorProduct");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.createBulkCopyProduct = catchAsync(async (req, res, next) => {

    try {

        let { shopId, selectedProducts } = req.body
        let vendorId = req.vendor._id

        /**
        * selectedProducts is array like:
        * [
        *    { productId: "123", vendorSellingPrice: "500" },
        *    { productId: "124", vendorSellingPrice: "800" },
        * ]
        */

        if (!selectedProducts || selectedProducts.length === 0) {
            return next(new AppError("No products selected", 400));
        }

        const productIds = selectedProducts.map(item => item.productId);

        const products = await Product.find({ _id: { $in: productIds } });

        const vendorProducts = selectedProducts.map(item => {
            const product = products.find(p => p._id.toString() === item.productId);
            if (!product) return null;

            return {
                vendorId,
                shopId,
                serviceId: product.serviceId,
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
                vendorSellingPrice: item.vendorSellingPrice,
                unitOfMeasurement: product.unitOfMeasurement,
                sellingUnit: product.sellingUnit,
                shortDescription: product.shortDescription,
                longDescription: product.longDescription,
            };
        }).filter(item => item !== null);

        await VendorProduct.insertMany(vendorProducts);

        return res.status(201).json({ message: "Vendor product added successfully", status: "success", vendorProducts });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }

})