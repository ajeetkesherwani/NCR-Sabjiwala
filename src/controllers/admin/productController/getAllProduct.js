const Product = require("../../../models/product")
const catchAsync = require("../../../utils/catchAsync");

exports.getAllProduct = catchAsync(async (req, res) => {

    const allProduct = await Product.find().sort({ createdAt: -1 }).populate(["categoryId"]).populate({ path: "subCategoryId", model: "Category" }).populate({ path: "variants", model: "ProductVarient" });

    return res.status(200).json({
        status: true,
        results: allProduct.length,
        data: allProduct
    })

})