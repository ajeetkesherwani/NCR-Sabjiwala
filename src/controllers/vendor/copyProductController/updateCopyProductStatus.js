const Product = require("../../../models/product");
const VendorProduct = require("../../../models/vendorProduct");
const catchAsync = require("../../../utils/catchAsync");

exports.updateCopyProductStatus = catchAsync(async (req, res) => {
    let id = req.params.id

    const { status } = req.body

    const product = await VendorProduct.findOneAndUpdate({ _id: id }, { $set: { status } }, { new: true })

    return res.status(200).json({
        status: true,
        data: product
    })

})