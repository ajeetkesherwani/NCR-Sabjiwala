const banner = require("../../../models/banner");
const Category = require("../../../models/category");
const Explore = require("../../../models/explore");
const User = require("../../../models/user");
const VendorProduct = require("../../../models/vendorProduct");
const Setting = require("../../../models/settings");
const { calculateOffer } = require("../../../utils/calculateOffer");
const catchAsync = require("../../../utils/catchAsync");
const { MART_SERVICE_ID } = require("../../../utils/constants");
const checkServiceability = require("../../../utils/checkServiceability");


const formatProduct = (prod) => ({
    _id: prod._id,
    name: prod.name,
    shopId: prod.shopId._id || null,
    vendorId: prod.vendorId,
    primary_image: prod.primary_image,
    sellingUnit: prod.sellingUnit,
    mrp: prod.mrp,
    price: prod.vendorSellingPrice,
    offer: calculateOffer(prod.mrp, prod.vendorSellingPrice),
    shortDescription: prod.shortDescription,
});

exports.getHomeDataGrocery = catchAsync(async (req, res) => {
    const serviceId = req.query.serviceId || MART_SERVICE_ID;
    
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

    // Check serviceability for grocery service
    const isServiceable = await checkServiceability(user._id, userCoords, apiKey, 'grocery');

    const typeFilter = user.userType === "veg" ? { type: "veg" } : {};
    const queryCommon = { status: "active", serviceId, ...typeFilter };

    // const [banners, categories, explore, featuredRaw, seasonalRaw, vegRaw, fruitRaw, kitchenRaw] = await Promise.all([
    //     banner.find({ serviceId }).select("image").sort({ createdAt: -1 }),
    //     Category.find({ cat_id: null, serviceId }).select("name image").limit(8).sort({ createdAt: -1 }),
    //     Explore.find({ serviceId }).select("name icon"),
    //     VendorProduct.find({ ...queryCommon, isFeatured: true }).limit(10).populate("shopId", "name lat long"),
    //     VendorProduct.find({ ...queryCommon, isSeasonal: true }).limit(10).populate("shopId", "name lat long"),
    //     VendorProduct.find({ ...queryCommon, isVegetableOfTheDay: true }).limit(10).populate("shopId", "name lat long"),
    //     VendorProduct.find({ ...queryCommon, isFruitOfTheDay: true }).limit(10).populate("shopId", "name lat long"),
    //     VendorProduct.find({ categoryId: "6854ffe193a2cab5ddcba4cf" }).limit(5).populate("shopId", "name lat long"),
    // ]);

    const [banners, categories, explore, featuredRaw, recommendedRaw] = await Promise.all([
        banner.find().select("image").sort({ createdAt: -1 }),
        Category.find({ cat_id: null, serviceId }).select("name image").limit(8).sort({ createdAt: -1 }),
        Explore.find({ serviceId }).select("name icon"),
<<<<<<< HEAD
        VendorProduct.find({ ...queryCommon, isFeatured: true }).limit(10).populate("shopId", "name lat long"),
        VendorProduct.find({ ...queryCommon, isRecommended: true }).limit(10).populate("shopId", "name lat long"),
=======
        VendorProduct.find({ ...queryCommon, isFeatured: true, isDeleted: false }).limit(10).populate("shopId", "name lat long"),
        VendorProduct.find({ ...queryCommon, isSeasonal: true, isDeleted: false }).limit(10).populate("shopId", "name lat long"),
        VendorProduct.find({ ...queryCommon, isVegetableOfTheDay: true, isDeleted: false }).limit(10).populate("shopId", "name lat long"),
        VendorProduct.find({ ...queryCommon, isFruitOfTheDay: true, isDeleted: false }).limit(10).populate("shopId", "name lat long"),
        VendorProduct.find({ categoryId: "6854ffe193a2cab5ddcba4cf" }).limit(5).populate("shopId", "name lat long"),
>>>>>>> 506cc98bccb177dbb020d33ce27de1504c36e82b
    ]);

    res.status(200).json({
        success: true,
        message: "Home data fetched successfully",
        data: {
            banners,
            categories,
            explore,
            featuredProducts: featuredRaw.map(formatProduct),
<<<<<<< HEAD
            fruitsProducts: recommendedRaw.map(formatProduct),
=======
            seasonalProducts: seasonalRaw.map(formatProduct),
            vegetableslProducts: vegRaw.map(formatProduct),
            fruitsProducts: fruitRaw.map(formatProduct),
            kitchenProducts: kitchenRaw.map(formatProduct),
            isServiceable
>>>>>>> 506cc98bccb177dbb020d33ce27de1504c36e82b
        },
    });
});



// data: {
//             banners,
//             categories,
//             explore,
//             featuredProducts: featuredRaw.map(formatProduct),
//             // seasonalProducts: seasonalRaw.map(formatProduct),
//             // vegetableslProducts: vegRaw.map(formatProduct),
//             fruitsProducts: fruitRaw.map(formatProduct),
//             // kitchenProducts: kitchenRaw.map(formatProduct),
//         },