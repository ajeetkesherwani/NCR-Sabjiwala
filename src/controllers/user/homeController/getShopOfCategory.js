const Category = require("../../../models/category");
const Setting = require("../../../models/settings");
const User = require("../../../models/user");
const VendorProduct = require("../../../models/vendorProduct");
const Shop = require("../../../models/shop");
const ShopCategoryPriority = require("../../../models/ShopCategoryPriority");
const catchAsync = require("../../../utils/catchAsync");
const getDistanceAndTime = require("../../../utils/getDistanceAndTime"); // Import the utility
const { default: mongoose } = require("mongoose");

exports.getShopOfCategory = catchAsync(async (req, res, next) => {
    try {

        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const setting = await Setting.findById("680f1081aeb857eee4d456ab");
        const apiKey = setting?.googleMapApiKey || "working";

        // Get user's coordinates
        const userCoords = {
            lat: parseFloat(user.lat || 0),
            long: parseFloat(user.long || 0),
        };

        const userType = user.userType;
        const typeFilter = user.userType === "veg" ? { type: "veg" } : {}; // empty means no filter

        const categoryId = req.params.categoryId;

        // First get shops with priority for this category
        const priorityShops = await ShopCategoryPriority.aggregate([
            { $match: { categoryId: new mongoose.Types.ObjectId(categoryId) } },
            { $sort: { priority: -1 } }, // Sort by priority in descending order (highest first)
            {
                $lookup: {
                    from: 'shops',
                    localField: 'shopId',
                    foreignField: '_id',
                    as: 'shop'
                }
            },
            { $unwind: '$shop' },
            { $match: { 'shop.status': 'active' } }
        ]);

        // Get all active shops for this category
        const products = await VendorProduct.find({
            status: "active",
            categoryId,
            ...typeFilter,
            isDeleted: false
        }).populate("shopId", "name shopImage galleryImage address lat long rating");

        if (!products || products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No products found'
            });
        }

        const uniqueShopsMap = new Map();
        const shopPromises = []; // To store promises for distance/time calculation

        // First add priority shops
        priorityShops.forEach((ps) => {
            if (ps.shop && !uniqueShopsMap.has(ps.shop._id.toString())) {
                const shopData = {
                    _id: ps.shop._id,
                    name: ps.shop.name,
                    shopImage: ps.shop.galleryImage ? ps.shop.galleryImage[0] : ps.shop.shopImage,
                    shopImage2: ps.shop.shopImage,
                    address: ps.shop.address,
                    priority: ps.priority,
                    rating: parseFloat(ps.shop.rating || 0),
                    time: null,
                    distance: null,
                    shopLat: parseFloat(ps.shop.lat || 0),
                    shopLong: parseFloat(ps.shop.long || 0),
                };
                uniqueShopsMap.set(ps.shop._id.toString(), shopData);

                // Add a promise to calculate distance and time for priority shops
                if (shopData.shopLat !== 0 || shopData.shopLong !== 0) {
                    shopPromises.push(
                        (async () => {
                            const shopCoords = { lat: shopData.shopLat, long: shopData.shopLong };
                            const { distance, time } = await getDistanceAndTime(userCoords, shopCoords, apiKey);
                            shopData.distance = distance;
                            shopData.time = time;
                        })()
                    );
                }
            }
        });

        // Then add remaining shops
        products.forEach((p) => {
            if (p.shopId && !uniqueShopsMap.has(p.shopId._id.toString())) {
                const shopData = {
                    _id: p.shopId._id,
                    name: p.shopId.name,
                    shopImage: p.shopId.galleryImage ? p.shopId.galleryImage[0] : p.shopId.shopImage,
                    shopImage2: p.shopId.shopImage,
                    address: p.shopId.address,
                    priority: null,
                    rating: parseFloat(p.shopId.rating || 0),
                    time: null,
                    distance: null,
                    shopLat: parseFloat(p.shopId.lat || 0),
                    shopLong: parseFloat(p.shopId.long || 0),
                };
                uniqueShopsMap.set(p.shopId._id.toString(), shopData);

                // Add a promise to calculate distance and time for this shop
                // Only add if shop has valid coordinates
                if (shopData.shopLat !== 0 || shopData.shopLong !== 0) { // Check if coordinates are valid
                    shopPromises.push(
                        (async () => {
                            const shopCoords = { lat: shopData.shopLat, long: shopData.shopLong };
                            const { distance, time } = await getDistanceAndTime(userCoords, shopCoords, apiKey);
                            shopData.distance = distance;
                            shopData.time = time;
                        })()
                    );
                }
            }
        });

        // Wait for all distance/time calculations to complete
        await Promise.all(shopPromises);

        // Convert Map values to an array and sort
        let uniqueShops = Array.from(uniqueShopsMap.values());

        // Sort shops: first by priority (highest to lowest), then by rating (highest to lowest)
        uniqueShops.sort((a, b) => {
            // If both have priority, sort by priority (highest first)
            if (a.priority !== null && b.priority !== null) {
                return a.priority - b.priority; // Lower priority number means higher priority
            }
            // If only one has priority, it should come first
            if (a.priority !== null) return -1;
            if (b.priority !== null) return 1;
            // If neither has priority, sort by rating (highest first)
            return b.rating - a.rating;
        });

        // Remove temporary properties
        uniqueShops.forEach(shop => {
            delete shop.shopLat;
            delete shop.shopLong;
        });


        return res.status(200).json({
            success: true,
            message: 'Products retrieved successfully',
            length: uniqueShops.length,
            data: uniqueShops
        });

    } catch (error) {
        console.error('Error in get category controller:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});