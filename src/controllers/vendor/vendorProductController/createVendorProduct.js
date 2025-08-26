const Product = require("../../../models/product");
const VendorProduct = require("../../../models/vendorProduct");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

const validateRequiredField = (field, fieldName) => {
    if (!field || !field.trim()) return new AppError(`${fieldName} is required.`, 400);
    return null;
};

exports.createVendorProduct = catchAsync(async (req, res, next) => {
    let { name, categoryId, subCategoryId, shopId, mrp, sellingPrice, unitOfMeasurement, sellingUnit, shortDescription, longDescription, serviceId, type } = req.body;

    const requiredFields = [
        { field: name, name: "Product name" },
        { field: categoryId, name: "Category ID" },
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

    const vendorId = req.vendor._id;
    if (!vendorId) return next(new AppError("Vendor ID is required.", 400));

    // let skuProduct = await Product.findOne({ sku });
    // if (skuProduct) return next(new AppError("SKU is already exists. Plz enter different SKU No.", 400));

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


    let product = new VendorProduct({
        name,
        categoryId,
        subCategoryId: subCategoryId || null,
        vendorId,
        shopId,
        primary_image: primaryImage,
        gallery_image: galleryimagePaths,
        mrp,
        vendorSellingPrice: sellingPrice,
        unitOfMeasurement,
        sellingUnit,
        shortDescription,
        longDescription,
        serviceId,
        type
    });

    await product.save();

    return res.status(201).json({
        status: true,
        message: "Product added successfully.",
        data: { product },
        newProduct: true,
    });
});