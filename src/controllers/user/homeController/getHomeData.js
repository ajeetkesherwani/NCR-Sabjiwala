const banner = require("../../../models/banner");
const Explore = require("../../../models/explore");
const Setting = require("../../../models/settings");
const Shop = require("../../../models/shop");
const User = require("../../../models/user");
const VendorProduct = require("../../../models/vendorProduct");
const { calculateOffer } = require("../../../utils/calculateOffer");
const catchAsync = require("../../../utils/catchAsync");
const getDistanceAndTime = require("../../../utils/getDistanceAndTime");
const findNearbyShops = require("../../../utils/findNearbyShops");
const { FOOD_SERVICE_ID } = require("../../../utils/constants");
const checkServiceability = require("../../../utils/checkServiceability");
const Category = require("../../../models/category");


const formatProduct = async (prod, userCoords, apiKey) => {
    const shopCoords = {
        lat: parseFloat(prod.shopId?.lat || 0),
        long: parseFloat(prod.shopId?.long || 0),
    };

    const { distance, time } = await getDistanceAndTime(userCoords, shopCoords, apiKey);

    return {
        _id: prod._id,
        shopId: prod.shopId?._id,
        vendorId: prod.vendorId,
        shopName: prod.shopId?.name || "",
        primary_image: prod.primary_image,
        shortDescription: prod.shortDescription,
        price: prod.vendorSellingPrice,
        mrp: prod.mrp,
        offer: calculateOffer(prod.mrp, prod.vendorSellingPrice),
        distance,
        time
    };
};

exports.getHomeData = catchAsync(async (req, res) => {
    const serviceId = FOOD_SERVICE_ID;
    if (!serviceId) return res.status(400).json({ success: false, message: "Service ID is required" });

    // Fetch initial data in parallel
    const [setting, user] = await Promise.all([
        Setting.findById("680f1081aeb857eee4d456ab"),
        User.findById(req.user._id)
    ]);

    const apiKey = setting?.googleMapApiKey || "working";
    const userCoords = {
        lat: parseFloat(user.lat || 0),
        long: parseFloat(user.long || 0),
    };

    // Check serviceability using the new utility function
    const isServiceable = await checkServiceability(user._id, userCoords, apiKey, 'food');

    // Determine filters based on user preferences
    const typeFilter = user.userType === "veg" ? { type: "veg" } : {};
    const shopTypeFilter = user.userType === "veg"
        ? { shopType: { $in: ["veg", "both"] } }
        : {};

    const nearbyShops = await findNearbyShops(userCoords, serviceId, 20, shopTypeFilter);
    const shopIdsInRadius = nearbyShops.map(shop => shop._id);

    // ✅ STEP 2: Common product query with radius shop filter
    const commonQuery = {
        status: "active",
        serviceId,
        ...typeFilter,
        shopId: { $in: shopIdsInRadius }
    };

    // ✅ STEP 3: Fetch home data
    const [banners, categories, explore, recommendedRaw, featuredRaw, shops] = await Promise.all([
        banner.find({ serviceId }).select("image").sort({ createdAt: -1 }),
        Category.find({ cat_id: null, serviceId, status: "active", priority: { $gte: 1, $lte: 10 } }).select("name image").limit(8).sort({ priority: 1 }),
        Explore.find({ serviceId }).select("name icon"),
        VendorProduct.find({ ...commonQuery, isRecommended: true, isDeleted: false }).limit(10).populate("shopId", "name lat long"),
        VendorProduct.find({ ...commonQuery, isFeatured: true, isDeleted: false }).limit(10).populate("shopId", "name lat long"),
        Shop.find({ priority: { $gte: 1, $lte: 10 } }).sort({ priority: 1 })
    ]);

    // ✅ STEP 4: Format products with distance/time
    const recommendedProducts = await Promise.all(
        recommendedRaw.map(p => formatProduct(p, userCoords, apiKey))
    );

    const featuredProducts = await Promise.all(
        featuredRaw.map(p => formatProduct(p, userCoords, apiKey))
    );

    const formattedShops = await Promise.all(shops.map(async shop => {
        const shopCoords = {
            lat: parseFloat(shop.lat || 0),
            long: parseFloat(shop.long || 0),
        };

        const { distance, time } = await getDistanceAndTime(userCoords, shopCoords, apiKey);

        return {
            _id: shop._id,
            name: shop.name,
            image: shop.shopImage,
            distance,
            time,
            rating: shop.rating || "0"
        };
    }));


    // io.emit("new-order", {
    //     _id: "order123",
    //     customerName: "John Doe",
    //     items: [{ name: "Pizza" }, { name: "Burger" }]
    // });

    res.status(200).json({
        success: true,
        message: "Home data fetched successfully",
        data: {
            banners,
            categories,
            explore,
            recommendedProducts,
            featuredProducts,
            formattedShops,
            isServiceable
        },
    });
});