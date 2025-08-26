const Product = require("../../../models/product");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.updateProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let {
        name,
        categoryId,
        subCategoryId,
        brandId,
        sku,
        mrp,
        sellingPrice,
        discount,
        unitOfMeasurement,
        sellingUnit,
        shortDescription,
        longDescription,
        serviceId,
        status,
    } = req.body;

    const product = await Product.findById(id);
    if (!product) return next(new AppError("Product not found", 404));

    // If a new SKU is provided and it's different, verify uniqueness.
    if (sku && sku !== product.sku) {
        let skuProduct = await Product.findOne({ sku });
        if (skuProduct)
            return next(new AppError("SKU already exists. Please use a different SKU.", 400));
    }

    // Update primary image if a new file was provided.
    let primaryImage = product.primary_image;
    if (req.files && req.files.primary_image && req.files.primary_image.length > 0) {
        // Delete the old primary image if available.
        // if (product.primary_image) {
        //     await deleteOldFiles(product.primary_image);
        // }
        primaryImage = `${req.files.primary_image[0].destination}/${req.files.primary_image[0].filename}`;
    }

    // Update gallery images if new files were provided.
    let galleryImages = product.gallery_image;
    if (req.files && req.files.gallery_image && req.files.gallery_image.length > 0) {
        // Delete all old gallery images.
        // if (Array.isArray(product.gallery_image) && product.gallery_image.length > 0) {
        //     await Promise.all(product.gallery_image.map((imgPath) => deleteOldFiles(imgPath)));
        // }
        galleryImages = req.files.gallery_image.map(
            (file) => `${file.destination}/${file.filename}`
        );
    }

    // Update other fields.
    product.name = name || product.name;
    product.categoryId = categoryId || product.categoryId;
    product.subCategoryId = subCategoryId || product.subCategoryId;
    product.brandId = brandId || product.brandId;
    product.sku = sku || product.sku;
    product.mrp = mrp || product.mrp;
    product.sellingPrice = sellingPrice || product.sellingPrice;
    product.discount = discount || product.discount;
    product.unitOfMeasurement = unitOfMeasurement || product.unitOfMeasurement;
    product.sellingUnit = sellingUnit || product.sellingUnit;
    product.shortDescription = shortDescription || product.shortDescription;
    product.longDescription = longDescription || product.longDescription;
    product.serviceId = serviceId || product.serviceId;
    product.status = status || product.status;
    product.primary_image = primaryImage;
    product.gallery_image = galleryImages;

    await product.save();

    return res.status(200).json({
        status: true,
        message: "Product updated successfully.",
        data: { product },
    });
});
