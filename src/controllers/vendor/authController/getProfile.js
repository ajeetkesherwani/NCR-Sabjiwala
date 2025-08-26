const Product = require("../../../models/product");
const ShopSchedule = require("../../../models/shopSchedule");
const Vendor = require("../../../models/vendor");
const VendorAccount = require("../../../models/vendorAccount");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getProfile = catchAsync(async (req, res, next) => {

    let vendor = await Vendor.findOne({ _id: req.vendor._id });
    // const vendorAccountDetails = await VendorAccount.findOne({ vendorId: vendor._id });
    // const shopTime = await ShopSchedule.findOne({ vendorId: vendor._id })

    // let productCount = await Product.countDocuments({ vendorId: vendor._id });
    // vendor = vendor.toObject();
    // vendor.productCount = productCount;

    return res.status(200).json({
        status: true,
        message: "Vendor Profile",
        data: { vendor }
    });
});