const Product = require("../../../models/product");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllProduct = catchAsync(async (req, res, nex) => {

    const serviceId = req.params.serviceId;
    const vendor_id = req.vendor._id
    var allProduct;

    if (serviceId != "all") {
        allProduct = await Product.find({ vendorId: vendor_id, serviceId });
    } else {
        allProduct = await Product.find({ vendorId: vendor_id });
    }

    // const allProduct = await Product.find({ status: "active", vendorId: vendor_id });

    return res.status(200).json({
        status: "success",
        results: allProduct.length,
        data: allProduct
    });
})