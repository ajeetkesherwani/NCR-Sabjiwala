
const Product = require("../../../models/product");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const path = require("path")

exports.updateProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
        return next(new AppError("Product not found", 404));
    }

    const {
        title,
        description,
        categoryId,
        subCategoryId,
        tags,
        isDealOfTheDay,
        isAvailable,
        isReturnAvailable,
        isFavorite,
        details = {},
        info = {}
    } = req.body;

    // Parse JSON strings from multipart/form-data
    const parsedDetails = typeof details === 'string' ? JSON.parse(details) : details;
    const parsedInfo = typeof info === 'string' ? JSON.parse(info) : info;

    // Handle uploaded images
    let imageUrls = existingProduct.images || [];
    if (req.files && req.files.images && req.files.images.length > 0) {
        imageUrls = req.files.images.map((file) => path.join(file.destination, file.filename).replace(/\\/g, "/"));
    }

    // Update fields
    existingProduct.name = title || existingProduct.name;
    existingProduct.description = description || existingProduct.description;
    existingProduct.images = imageUrls;
    existingProduct.categoryId = categoryId || existingProduct.categoryId;
    existingProduct.subCategoryId = subCategoryId || existingProduct.subCategoryId;
    existingProduct.tags = Array.isArray(tags)
        ? tags
        : typeof tags === 'string'
            ? JSON.parse(tags)
            : [];
    existingProduct.isDealOfTheDay = isDealOfTheDay ?? existingProduct.isDealOfTheDay;
    existingProduct.isAvailable = isAvailable ?? existingProduct.isAvailable;
    existingProduct.isReturnAvailable = isReturnAvailable ?? existingProduct.isReturnAvailable;
    existingProduct.isFavorite = isFavorite ?? existingProduct.isFavorite;
    existingProduct.details = {
        nutrientValue: parsedDetails.nutrientValue || '',
        about: parsedDetails.about || '',
        description: parsedDetails.description || ''
    };
    existingProduct.info = {
        shelfLife: parsedInfo.shelfLife || '',
        returnPolicy: parsedInfo.returnPolicy || '',
        storageTips: parsedInfo.storageTips || '',
        country: parsedInfo.country || '',
        help: parsedInfo.help || '',
        disclaimer: parsedInfo.disclaimer || '',
        seller: parsedInfo.seller || '',
        fssai: parsedInfo.fssai || ''
    };
    existingProduct.updatedAt = new Date();

    await existingProduct.save();

    return res.status(200).json({
        status: true,
        message: "Product updated successfully.",
        data: { product: existingProduct }
    });
});
