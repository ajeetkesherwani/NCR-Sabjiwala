const Shop = require("../../../models/shop");
const VendorProduct = require("../../../models/vendorProduct");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

const ShopCategoryPriority = require("../../../models/ShopCategoryPriority");

exports.getShopsByCategory = catchAsync(async (req, res, next) => {
    const { categoryId } = req.params;
    if (!categoryId) {
        return next(new AppError("categoryId is required", 400));
    }

    // Step 1: Find unique shopIds that have products in this category
    const shopIds = await VendorProduct.find({isDeleted: false}).distinct("shopId", { categoryId });

    if (shopIds.length === 0) {
        return res.status(200).json({
            status: true,
            results: 0,
            data: [],
        });
    }

    // Step 2: Find shopIds that already have a priority set for this category
    const prioritized = await ShopCategoryPriority.find({ categoryId }).select("shopId").lean();
    const prioritizedShopIds = new Set(prioritized.map(p => String(p.shopId)));

    // Step 3: Filter out shops that already have a priority
    const filteredShopIds = shopIds.filter(id => !prioritizedShopIds.has(String(id)));

    if (filteredShopIds.length === 0) {
        return res.status(200).json({
            status: true,
            results: 0,
            data: [],
        });
    }

    // Step 4: Fetch shop details for remaining shops
    const shops = await Shop.find({ _id: { $in: filteredShopIds }, status: "active" })
        .populate("serviceId", "name")
        .populate("vendorId", "name");

    return res.status(200).json({
        status: true,
        results: shops.length,
        data: shops,
    });
});
