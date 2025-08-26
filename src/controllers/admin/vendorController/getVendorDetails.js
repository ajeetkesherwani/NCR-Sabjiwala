const Product = require("../../../models/product");
const ShopSchedule = require("../../../models/shopSchedule");
const Vendor = require("../../../models/vendor");
const VendorAccount = require("../../../models/vendorAccount");
const catchAsync = require("../../../utils/catchAsync");

exports.getVendorDetails = catchAsync(async (req, res) => {
    let id = req.params.id

    let vendor = await Vendor.findById(id);
    // let vendor = await Vendor.findById(id).populate("service_id", "name");
    const bankDetails = await VendorAccount.findOne({ vendorId: vendor._id })
    const shopTime = await ShopSchedule.findOne({ vendorId: vendor._id })

    let productCount = await Product.countDocuments({ vendorId: vendor._id });
    vendor = vendor.toObject();
    vendor.productCount = productCount;

    return res.status(200).json({
        status: true,
        data: { vendor, bankDetails, shopTime }
    })
})