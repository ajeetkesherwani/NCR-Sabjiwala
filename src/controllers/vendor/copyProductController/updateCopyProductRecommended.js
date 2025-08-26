const Product = require("../../../models/product");
const VendorProduct = require("../../../models/vendorProduct");
const catchAsync = require("../../../utils/catchAsync");

exports.updateCopyProductRecommended = catchAsync(async (req, res) => {
    let id = req.params.id

    const { isRecommended } = req.body
    console.log("isRecommended", isRecommended);

    const product = await VendorProduct.findOneAndUpdate({ _id: id }, { $set: { isRecommended } }, { new: true })

    return res.status(200).json({
        status: true,
        data: product
    })

})