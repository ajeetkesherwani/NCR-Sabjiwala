const Product = require("../../../models/product");
const Shop = require("../../../models/shop");
const Vendor = require("../../../models/vendor");
const VendorProduct = require("../../../models/vendorProduct");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllProductOfShop = catchAsync(async (req, res, next) => {

    const vendor_id = req.vendor._id
    const { shopId } = req.params

    const allProduct = await VendorProduct.find({ vendorId: vendor_id, shopId, isDeleted: false }).sort({ createdAt: -1 }).populate(["categoryId", "brandId", "vendorId"]).populate({ path: "subCategoryId", model: "Category" });
    const vendorDetails = await Vendor.find({ _id: vendor_id });
    const shopDetails = await Shop.find({ _id: shopId });
    // if (allProduct.length == 0) return next(new AppError("No product found", 400));
    if (allProduct.length == 0) {
        return res.status(200).json({
            status: "false",
            results: allProduct.length,
            message: "No product found",
            data: { allProduct, vendorDetails, shopDetails }
        });
    }

    return res.status(200).json({
        status: "success",
        results: allProduct.length,
        data: { allProduct, vendorDetails, shopDetails }
    });
})