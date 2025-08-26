const Product = require("../../../models/product");
const catchAsync = require("../../../utils/catchAsync");

exports.getVendorProduct = catchAsync(async (req, res) => {

    let id = req.params.id;

    const products = await Product.find({ vendorId: id }, "name primary_image mrp sellingPrice status").populate("categoryId", "name").populate({ path: "subCategoryId", model: "Category", select: "name" });
    return res.status(200).json({
        status: true,
        results: products.length,
        data: products
    })

})