const Category = require("../../../models/category");
const Setting = require("../../../models/settings");
const User = require("../../../models/user");
const catchAsync = require("../../../utils/catchAsync");
const getDistanceAndTime = require("../../../utils/getDistanceAndTime"); // Import the utility

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

        // Ensure shopId is populated with lat and long
        const products = await VendorProduct.find({ status: "active", categoryId, ...typeFilter })
            .populate("shopId", "name shopImage galleryImage address lat long"); // Explicitly request lat and long

        if (!products || products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No products found'
            });
        }

        const uniqueShopsMap = new Map();
        const shopPromises = []; // To store promises for distance/time calculation

        products.forEach((p) => {
            if (p.shopId && !uniqueShopsMap.has(p.shopId._id.toString())) {
                const shopData = {
                    _id: p.shopId._id,
                    name: p.shopId.name,
                    shopImage: p.shopId.galleryImage ? p.shopId.galleryImage[0] : p.shopId.shopImage, // Use first gallery image or shopImage
                    shopImage2: p.shopId.shopImage,
                    address: p.shopId.address,
                    // Temporarily set time and distance to default or null, will be updated later
                    time: null,
                    distance: null,
                    // Store shop's raw coordinates for calculation
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

        // Convert Map values to an array for the final response
        const uniqueShops = Array.from(uniqueShopsMap.values());

        // Remove temporary shopLat/shopLong properties if not needed in final response
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