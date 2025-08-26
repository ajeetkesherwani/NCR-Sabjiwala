const VendorProduct = require("../../../models/vendorProduct");
const catchAsync = require("../../../utils/catchAsync");

exports.toggleProductFlag = catchAsync(async (req, res) => {
    const { productId, field } = req.body;

    // ✅ Validating required fields
    if (!productId || !field) {
        return res.status(400).json({
            status: false,
            message: "Both productId and field are required",
        });
    }

    // ✅ Define allowed fields
    const allowedFields = [
        "isRecommended",
        "isFeatured",
        "isSeasonal",
        "isVegetableOfTheDay",
        "isFruitOfTheDay"
    ];

    if (!allowedFields.includes(field)) {
        return res.status(400).json({
            status: false,
            message: `Invalid field. Allowed fields are: ${allowedFields.join(", ")}`
        });
    }

    // ✅ Fetch product
    const product = await VendorProduct.findById(productId);
    if (!product) {
        return res.status(404).json({
            status: false,
            message: "Product not found",
        });
    }

    // ✅ Toggle the flag
    product[field] = !product[field];
    await product.save();

    return res.status(200).json({
        status: true,
        message: `Successfully toggled ${field}`,
        updatedValue: product[field],
    });
});
