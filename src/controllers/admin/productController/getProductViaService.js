const Product = require("../../../models/product");
const catchAsync = require("../../../utils/catchAsync");

exports.getProductViaService = catchAsync(async (req, res) => {

    const id = req.params.id

    const allProduct = await Product.find({serviceId: id}).sort({ createdAt: -1 }).populate(["categoryId", "brandId", "serviceId", "vendorId"]).populate({ path: "subCategoryId", model: "Category" })

    return res.status(200).json({
        status: true,
        results: allProduct.length,
        data: allProduct
    })

})