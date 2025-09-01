const Setting = require("../../../models/settings");
const User = require("../../../models/user");
const catchAsync = require("../../../utils/catchAsync");
const { FOOD_SERVICE_ID, MART_SERVICE_ID } = require("../../../utils/constants");
const getDistanceAndTime = require("../../../utils/getDistanceAndTime");

exports.getShopList = catchAsync(async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const setting = await Setting.findById("680f1081aeb857eee4d456ab");
        const apiKey = setting?.googleMapApiKey || "working";

        const userCoords = {
            lat: parseFloat(user.lat || 0),
            long: parseFloat(user.long || 0),
        };

        const userType = user.userType || "veg";
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        // serviceId - 67ecc79120a93fc0b92a8b19 food // 67ecc79a20a93fc0b92a8b1b grocery
        let serviceId;
        if (user.serviceType == "food") {
            serviceId = FOOD_SERVICE_ID;
        } else {
            serviceId = MART_SERVICE_ID;
        }


        const shopTypeFilter = userType === "veg"
            ? { shopType: { $in: ["veg", "both"] } }
            : {};

        // Step 1: Get all nearby shops (no pagination yet)
        const allNearbyShops = await Shop.find({
            status: "active",
            ...shopTypeFilter,
            // serviceId
        });

        // Step 2: Get shopIds
        const nearbyShopIds = allNearbyShops.map(shop => shop._id);

        // Step 3: Find products for those shops
        const products = await VendorProduct.find({
            status: "active",
            shopId: { $in: nearbyShopIds },
        }).populate("shopId", "name shopImage galleryImage address lat long location");

        // Step 4: Collect unique shops that have products
        const uniqueShopsMap = new Map();
        const shopPromises = [];

        products.forEach((p) => {
            if (p.shopId && !uniqueShopsMap.has(p.shopId._id.toString())) {
                const shopData = {
                    _id: p.shopId._id,
                    name: p.shopId.name,
                    shopImage: p.shopId.galleryImage?.[0] || p.shopId.shopImage,
                    shopImage2: p.shopId.shopImage,
                    address: p.shopId.address,
                    time: null,
                    distance: null,
                    shopLat: parseFloat(p.shopId.lat || 0),
                    shopLong: parseFloat(p.shopId.long || 0),
                };
                uniqueShopsMap.set(p.shopId._id.toString(), shopData);

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

        await Promise.all(shopPromises);

        // Step 5: Convert to array and paginate
        const allShopsWithProducts = Array.from(uniqueShopsMap.values());
        const paginatedShops = allShopsWithProducts.slice(skip, skip + limit);

        paginatedShops.forEach(shop => {
            delete shop.shopLat;
            delete shop.shopLong;
        });

        return res.status(200).json({
            success: true,
            message: 'Shops retrieved successfully',
            length: paginatedShops.length,
            data: paginatedShops
        });

    } catch (error) {
        console.error('Error in shop list:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});
