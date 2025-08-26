const Product = require("../../../models/product");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllProductForAssign = catchAsync(async (req, res, nex) => {

    const allProduct = await Product.find({ status: "active" }).sort({ createdAt: -1 }).populate(["categoryId", "brandId", "serviceId", "vendorId"]).populate({ path: "subCategoryId", model: "Category" });

    return res.status(200).json({
        status: "success",
        results: allProduct.length,
        data: allProduct
    });
})