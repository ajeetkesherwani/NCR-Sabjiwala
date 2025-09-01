const Product = require("../../../models/product");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const path = require("path");

// const validateRequiredField = (field, fieldName) => {
//     if (!field || (typeof field === 'string' && !field.trim())) {
//         return new AppError(`${fieldName} is required.`, 400);
//     }
//     return null;
// };

exports.createProduct = catchAsync(async (req, res, next) => {
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
    info = {},
    mrp,
    price,
  } = req.body;

  // Parse JSON strings if sent via multipart/form-data
  const parsedDetails =
    typeof details === "string" ? JSON.parse(details) : details;
  const parsedInfo = typeof info === "string" ? JSON.parse(info) : info;

  // Validate required fields
  // const requiredFields = [
  //     { field: title, name: "Title" },
  //     { field: category, name: "Category ID" }
  // ];
  // for (const { field, name } of requiredFields) {
  //     const error = validateRequiredField(field, name);
  //     if (error) return next(error);
  // }

  // Handle product-level images
  let imageUrls = [];
  if (req.files && req.files.images) {
    imageUrls = req.files.images.map((file) =>
      path.join(file.destination, file.filename).replace(/\\/g, "/")
    );
  }

  // Create Product (without variants)
  const product = new Product({
    name: title,
    description,
    images: imageUrls,
    categoryId,
    subCategoryId,
    tags: tags || [],
    isDealOfTheDay: isDealOfTheDay || false,
    isAvailable: isAvailable !== undefined ? isAvailable : true,
    isReturnAvailable: isReturnAvailable || false,
    isFavorite: isFavorite || false,
    details: {
      nutrientValue: parsedDetails.nutrientValue || "",
      about: parsedDetails.about || "",
      description: parsedDetails.description || "",
    },
    info: {
      shelfLife: parsedInfo.shelfLife || "",
      returnPolicy: parsedInfo.returnPolicy || "",
      storageTips: parsedInfo.storageTips || "",
      country: parsedInfo.country || "",
      help: parsedInfo.help || "",
      disclaimer: parsedInfo.disclaimer || "",
      seller: parsedInfo.seller || "",
      fssai: parsedInfo.fssai || "",
    },
    price: price || 0,
    mrp: mrp || 0,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await product.save();

  return res.status(201).json({
    status: true,
    message: "Product created successfully. You can now add variants.",
    data: { product },
  });
});
