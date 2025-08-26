const Product = require("../../../models/product");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

// Simple validation helper (adjust as per your implementation)
function validateRequiredField(field, name) {
    if (field === undefined || field === null || field === "") {
        return new AppError(`${name} is required.`, 400);
    }
    return null;
}

exports.updateProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) return next(new AppError("Product not found.", 404));

    const {
        name,
        categoryId,
        subCategoryId,
        mrp,
        sellingPrice,
        discount,
        unitOfMeasurement,
        sellingUnit,
        shortDescription,
        longDescription,
        serviceId,
        type,
    } = req.body;

    // Validate required fields
    const requiredFields = [
        { field: name, name: "Product name" },
        { field: categoryId, name: "Category ID" },
        { field: mrp, name: "MRP" },
        { field: sellingPrice, name: "Selling Price" },
        { field: unitOfMeasurement, name: "Unit of Measurement" },
        { field: sellingUnit, name: "Selling Unit" },
        { field: shortDescription, name: "Short Description" },
        { field: longDescription, name: "Long Description" },
        { field: serviceId, name: "Service Type" },
    ];

    for (const { field, name } of requiredFields) {
        const error = validateRequiredField(field, name);
        if (error) return next(error);
    }

    // Handle gallery images update safely
    let galleryimagePaths = product.gallery_image;
    if (
        req.files &&
        req.files.gallery_image &&
        Array.isArray(req.files.gallery_image) &&
        req.files.gallery_image.length > 0
    ) {
        galleryimagePaths = req.files.gallery_image.map(
            (file) => `${file.destination}/${file.filename}`
        );
    }

    // Handle primary image update safely
    let primaryImage = product.primary_image;
    if (req.files && req.files.primary_image && req.files.primary_image[0]) {
        primaryImage = `${req.files.primary_image[0].destination}/${req.files.primary_image[0].filename}`;
    }

    // Update product fields
    product.name = name;
    product.categoryId = categoryId;
    product.subCategoryId = subCategoryId;
    product.mrp = mrp;
    product.sellingPrice = sellingPrice;
    product.discount = discount || "";
    product.unitOfMeasurement = unitOfMeasurement;
    product.sellingUnit = sellingUnit;
    product.shortDescription = shortDescription;
    product.longDescription = longDescription;
    product.serviceId = serviceId;
    product.type = type;
    product.primary_image = primaryImage;
    product.gallery_image = galleryimagePaths;

    await product.save();

    res.status(200).json({
        status: true,
        message: "Product updated successfully.",
        data: { product },
    });
});
