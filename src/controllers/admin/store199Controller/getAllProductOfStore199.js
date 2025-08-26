const Product = require("../../../models/product");
const Shop = require("../../../models/shop");
const store199Product = require("../../../models/store199Product");
const Vendor = require("../../../models/vendor");
const VendorProduct = require("../../../models/vendorProduct");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllProductOfStore199 = catchAsync(async (req, res, next) => {

    const allProduct = await store199Product.find({ status: "active" }).sort({ createdAt: -1 }).populate(["categoryId", "brandId", "vendorId"]).populate({ path: "subCategoryId", model: "Category" });
    if (allProduct.length == 0) {
        return res.status(200).json({
            status: "false",
            message: "No product found"
        });
    }

    return res.status(200).json({
        status: "true",
        results: allProduct.length,
        data: allProduct
    });
})