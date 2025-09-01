const ProductVarient = require("../../../models/productVarient");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const path = require("path")

exports.editProductVarient = catchAsync(async (req, res, next) => {
    const { productId, variantId } = req.params;
    const {
        name,
        price,
        originalPrice,
        discount,
        stock,
        unit,
        status
    } = req.body;

    // Validations
    if (stock < 0) {
        return next(new AppError("Stock cannot be negative.", 400));
    }

    if (status && !['active', 'inactive'].includes(status)) {
        return next(new AppError("Invalid variant status.", 400));
    }

    // Find existing variant
    const variant = await ProductVarient.findById(variantId);
    if (!variant) return next(new AppError("Variant not found.", 404));

    // Handle new image uploads (optional)
    let newImages = variant.images || [];
    if (req.files && req.files.images) {
        const uploadedImages = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
        const filePaths = uploadedImages.map(file => path.join(file.destination, file.filename).replace(/\\/g, "/"));
        newImages = [...newImages, ...filePaths]
    }

    // Update fields
    variant.name = name ?? variant.name;
    variant.price = price ?? variant.price;
    variant.originalPrice = originalPrice ?? variant.originalPrice;
    variant.discount = discount ?? variant.discount;
    variant.stock = stock ?? variant.stock;
    variant.unit = unit ?? variant.unit;
    variant.status = status ?? variant.status;
    variant.images = newImages;

    await variant.save();

    return res.status(200).json({
        status: true,
        message: "Variant updated successfully.",
        data: {
            variant
        }
    });
});
