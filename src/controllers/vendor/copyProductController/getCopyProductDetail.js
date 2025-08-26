const VendorProduct = require("../../../models/vendorProduct");
const catchAsync = require("../../../utils/catchAsync");

exports.getCopyProductDetail = catchAsync(async (req, res) => {

    let id = req.params.id;

    const product = await VendorProduct.findById(id).populate(["categoryId", "brandId", "vendorId", "shopId"]).populate({ path: "subCategoryId", model: "Category" })

    return res.status(200).json({
        status: true,
        data: product
    })

})