const Product = require("../../../models/product");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

const validateRequiredField = (field, fieldName) => {
    if (!field || !field.trim()) return new AppError(`${fieldName} is required.`, 400);
    return null;
};

exports.createProduct = catchAsync(async (req, res, next) => {
    let { name, categoryId, subCategoryId, brandId, sku, mrp, sellingPrice, discount, unitOfMeasurement, sellingUnit, shortDescription, longDescription, serviceId, status } = req.body;

    let vendorId = req.vendor._id

    const requiredFields = [
        { field: name, name: "Product name" },
        { field: categoryId, name: "Category ID" },
        { field: brandId, name: "Brand ID" },
        { field: sku, name: "SKU" },
        { field: mrp, name: "MRP" },
        { field: sellingPrice, name: "Selling price" },
        { field: unitOfMeasurement, name: "Unit of measurement" },
        { field: sellingUnit, name: "Selling unit" },
        { field: shortDescription, name: "Short Description" },
        { field: longDescription, name: "Long Description" },
        { field: serviceId, name: "Service Type" },
    ];

    for (const { field, name } of requiredFields) {
        const error = validateRequiredField(field, name);
        if (error) return next(error);
    }

    let skuProduct = await Product.findOne({ sku });
    if (skuProduct) return next(new AppError("SKU is already exists. Plz enter different SKU No.", 400));

    let galleryimagePaths;
    if (req.files && req.files.gallery_image) {
        const imagesUrls = req.files.gallery_image.map((file) => {
            return `${file.destination}/${file.filename}`;
        });
        galleryimagePaths = imagesUrls;
    }

    // primary_image
    let primaryImage;
    if (req.files && req.files.primary_image) {
        const url = `${req.files.primary_image[0].destination}/${req.files.primary_image[0].filename}`;
        primaryImage = url;
    } else {
        primaryImage = ""
    }


    let product = new Product({
        name,
        categoryId,
        subCategoryId,
        brandId,
        sku,
        primary_image: primaryImage,
        gallery_image: galleryimagePaths,
        mrp,
        sellingPrice,
        discount: discount || "",
        unitOfMeasurement,
        sellingUnit,
        shortDescription,
        longDescription,
        serviceId,
        vendorId,
        status: status || "active"
    });

    await product.save();

    return res.status(201).json({
        status: true,
        message: "Product added successfully.",
        data: { product },
        newProduct: true,
    });
});
