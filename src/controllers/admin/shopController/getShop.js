const Shop = require("../../../models/shop");
const VendorProduct = require("../../../models/vendorProduct");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getShop = catchAsync(async (req, res, next) => {

    // Get all shops and separate them into priority and non-priority
    const allShops = await Shop.find().populate('serviceId', 'name').populate('vendorId', 'name');
    if (!allShops) return next(new AppError("No shop found.", 404));

    // Separate shops with priority from those without
    const priorityShops = allShops.filter(shop => shop.priority !== null).sort((a, b) => a.priority - b.priority);
    const nonPriorityShops = allShops.filter(shop => shop.priority === null);

    // Combine the arrays with priority shops first
    const shops = [...priorityShops, ...nonPriorityShops];

    const shopsWithProductCounts = await Promise.all(
        shops.map(async (shop) => {
            const productCount = await VendorProduct.find({isDeleted: false}).countDocuments({ shopId: shop._id });
            return {
                ...shop.toObject(),
                productCount,
                wallet: 0
            };
        })
    );

    return res.status(200).json({
        status: true,
        results: shops.length,
        data: shopsWithProductCounts
    })

})