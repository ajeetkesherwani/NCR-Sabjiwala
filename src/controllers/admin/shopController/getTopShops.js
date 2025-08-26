
const Shop = require("../../../models/shop");
const VendorProduct = require("../../../models/vendorProduct");
const ShopCategoryPriority = require("../../../models/ShopCategoryPriority");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");



// list of top shops on that category
exports.getTopShops = catchAsync(async (req, res, next) => {
    const { categoryId } = req.params;
    if (!categoryId) {
        return next(new AppError("categoryId is required", 400));
    }

    // Step 1: Find shop priorities for this category, sorted by priority ascending (1 = top)
    const priorities = await ShopCategoryPriority.find({ categoryId })
        .sort({ priority: 1 })
        .lean();

    if (!priorities.length) {
        return res.status(200).json({
            status: true,
            results: 0,
            data: [],
        });
    }

    // Step 2: Get shopIds in order of priority
    const shopIdOrder = priorities.map(p => p.shopId);

    // Step 3: Fetch only required shop details for these shopIds
    let shops = await Shop.find({ _id: { $in: shopIdOrder }, status: "active" })
        .select("shopImage name shopType serviceId vendorId phone")
        .populate("serviceId", "name")
        .populate("vendorId", "name")
        .lean();

    // Step 4: Sort shops according to priority order and attach priority
    const shopMap = new Map(shops.map(shop => [String(shop._id), shop]));
    const result = priorities.map(p => {
        const shop = shopMap.get(String(p.shopId));
        if (!shop) return null;
        return {
            _id: shop._id,
            shopImage: shop.shopImage,
            name: shop.name,
            shopType: shop.shopType,
            service: shop.serviceId?.name || null,
            vendorName: shop.vendorId?.name || null,
            phone: shop.phone,
            priority: p.priority
        };
    }).filter(Boolean);

    return res.status(200).json({
        status: true,
        results: result.length,
        data: result,
    });
});



// add shop in that category
exports.addTopShop = catchAsync(async (req, res, next) => {
    const { categoryId, shopId, priority } = req.body;
    if (!categoryId || !shopId) {
        return next(new AppError("categoryId and shopId are required", 400));
    }

    // Check if shop already exists for this category
    const existing = await ShopCategoryPriority.findOne({ categoryId, shopId });
    if (existing) {
        return next(new AppError("Shop already exists in this category's priority list.", 400));
    }

    // Get all priorities for this category
    const priorities = await ShopCategoryPriority.find({ categoryId }).sort({ priority: 1 }).lean();
    let newPriority = 1;
    if (priorities.length > 0) {
        // If requested priority is not taken, use it, else assign max+1
        const taken = new Set(priorities.map(p => p.priority));
        if (typeof priority === 'number' && !taken.has(priority)) {
            newPriority = priority;
        } else {
            newPriority = priorities[priorities.length - 1].priority + 1;
        }
    } else if (typeof priority === 'number') {
        newPriority = priority;
    }

    const created = await ShopCategoryPriority.create({ categoryId, shopId, priority: newPriority });

    return res.status(200).json({
        status: true,
        data: created,
        message: "Shop priority for category set successfully.",
        assignedPriority: newPriority
    });
});



// update shop priority in that category
exports.updateTopShop = catchAsync(async (req, res, next) => {
    const { categoryId, shopId, priority } = req.body;
    if (!categoryId || !shopId || typeof priority !== 'number') {
        return next(new AppError("categoryId, shopId, and priority (number) are required", 400));
    }

    // Find the current record for this shop
    const current = await ShopCategoryPriority.findOne({ categoryId, shopId });
    if (!current) {
        return next(new AppError("ShopCategoryPriority not found for update", 404));
    }

    // Check if another shop already has the requested priority
    const other = await ShopCategoryPriority.findOne({ categoryId, priority });
    if (other && String(other.shopId) !== String(shopId)) {
        // Swap priorities
        await ShopCategoryPriority.findByIdAndUpdate(other._id, { priority: current.priority });
    }

    current.priority = priority;
    await current.save();

    return res.status(200).json({
        status: true,
        data: current,
        message: "Shop priority for category updated successfully."
    });
});



// delete shop from that category's top list
exports.deleteTopShop = catchAsync(async (req, res, next) => {
    const { categoryId, shopId } = req.body;
    if (!categoryId || !shopId) {
        return next(new AppError("categoryId and shopId are required", 400));
    }

    const deleted = await ShopCategoryPriority.findOneAndDelete({ categoryId, shopId });

    if (!deleted) {
        return next(new AppError("ShopCategoryPriority not found for delete", 404));
    }

    return res.status(200).json({
        status: true,
        message: "Shop removed from category's top list successfully."
    });
});



