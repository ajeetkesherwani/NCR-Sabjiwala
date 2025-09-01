
const product = require("../../../models/product");
const Product = require("../../../models/product");
const ProductVarient = require("../../../models/productVarient");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const path = require("path")

const validateRequiredField = (field, fieldName) => {
    if (!field || (typeof field === 'string' && !field.trim())) {
        return new AppError(`${fieldName} is required.`, 400);
    }
    return null;
};

exports.createProductVarient = catchAsync(async (req, res, next) => {
    const { productId } = req.params;
    const {
        name,
        price,
        originalPrice,
        discount,
        stock,
        unit,
        status
    } = req.body;

    // Validate fields
    const requiredFields = [
        { field: name, name: "Variant name" },
        { field: price, name: "Variant price" },
    ];
    for (const { field, name } of requiredFields) {
        const error = validateRequiredField(field, name);
        if (error) return next(error);
    }

    if (stock < 0) {
        return next(new AppError("Stock cannot be negative.", 400));
    }

    if (status && !['active', 'inactive'].includes(status)) {
        return next(new AppError("Invalid variant status.", 400));
    }

    // Find product
    const product = await Product.findById(productId);
    if (!product) return next(new AppError("Product not found.", 404));

    // Handle variant image uploads
    let variantImages = [];
    if (req.files && req.files.images) {
        variantImages = req.files.images.map(file => path.join(file.destination, file.filename).replace(/\\/g, "/"));
    }

    // Create variant
    const newVariant = await ProductVarient.create({
        productId: product._id,
        name,
        price,
        originalPrice,
        discount,
        stock,
        unit,
        status: status || 'active',
        images: variantImages
    });

    // Push variant into product.variants
    product.variants.push(newVariant._id);
    product.updatedAt = new Date();
    await product.save();

    return res.status(201).json({
        status: true,
        message: "Variant added successfully.",
        data: {
            productId: product._id,
            variant: newVariant
        }
    });
});
