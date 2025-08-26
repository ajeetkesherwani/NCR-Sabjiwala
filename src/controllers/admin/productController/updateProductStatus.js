const Product = require("../../../models/product");
const catchAsync = require("../../../utils/catchAsync");

exports.updateProductStatus = catchAsync(async (req, res) => {
    let id = req.params.id

    const { status } = req.body

    const product = await Product.findOneAndUpdate({ _id: id }, { $set: { status } }, { new: true })

    return res.status(200).json({
        status: true,
        data: product
    })

})