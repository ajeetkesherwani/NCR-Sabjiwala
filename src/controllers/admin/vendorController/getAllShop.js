const Shop = require("../../../models/shop");
const VendorProduct = require("../../../models/vendorProduct");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllShop = catchAsync(async (req, res, next) => {

    const { vendorId } = req.params;

    const shops = await Shop.find({ vendorId }).populate('serviceId', 'name');
    if (!shops) return next(new AppError("No shop found.", 404));

    const shopsWithProductCounts = await Promise.all(
        shops.map(async (shop) => {
            const productCount = await VendorProduct.find({isDeleted: false}).countDocuments({ shopId: shop._id });
            return {
                ...shop.toObject(),
                productCount
            };
        })
    );

    return res.status(200).json({
        status: true,
        results: shops.length,
        data: shopsWithProductCounts,
        // productCount: shopsWithProductCounts
    })

})