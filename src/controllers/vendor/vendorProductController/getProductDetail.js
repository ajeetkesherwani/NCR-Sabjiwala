const Product = require("../../../models/product");
const catchAsync = require("../../../utils/catchAsync");

exports.getProductDetail = catchAsync(async (req, res) => {

    let id = req.params.id;

    const product = await Product.findById(id).populate(["categoryId", "brandId", "serviceId", "vendorId"]).populate({ path: "subCategoryId", model: "Category" })

    return res.status(200).json({
        status: true,
        data: product
    })

})