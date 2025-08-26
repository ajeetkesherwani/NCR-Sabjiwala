const { default: mongoose } = require("mongoose");
const banner = require("../../../models/banner");
const Category = require("../../../models/category");
const Explore = require("../../../models/explore");
const User = require("../../../models/user");
const VendorProduct = require("../../../models/vendorProduct");
const { calculateOffer } = require("../../../utils/calculateOffer");
const catchAsync = require("../../../utils/catchAsync");
const { MART_SERVICE_ID } = require("../../../utils/constants");


const formatProduct = (prod) => ({
    _id: prod._id,
    name: prod.name,
    vendorId: prod.vendorId,
    shopId: prod.shopId._id,
    primary_image: prod.primary_image,
    sellingUnit: prod.sellingUnit,
    mrp: prod.mrp,
    price: prod.vendorSellingPrice,
    offer: calculateOffer(prod.mrp, prod.vendorSellingPrice),
    shortDescription: prod.shortDescription,
});

exports.getSpecialGroceryProduct = catchAsync(async (req, res) => {
    const serviceId = req.query.serviceId || MART_SERVICE_ID;
    const user = await User.findById(req.user._id);
    const typeFilter = user.userType === "veg" ? { type: "veg" } : {};
    const specialGrocery = req.query.specialGrocery;

    const queryCommon = { status: "active", serviceId, ...typeFilter };

    const queryFilters = {};

    if (specialGrocery == "FruitOfTheDay") {
        queryFilters.isFruitOfTheDay = true
    } else if (specialGrocery == "VegetableOfTheDay") {
        queryFilters.isVegetableOfTheDay = true
    } else if (specialGrocery == "Featured") {
        queryFilters.isFeatured = true
    } else if (specialGrocery == "Seasonal") {
        queryFilters.isSeasonal = true
    } else if (specialGrocery == "Recommended") {
        queryFilters.isRecommended = true
    } else if (specialGrocery == "Kitchen") {
        // queryFilters.isKitchen = true
        queryFilters.categoryId = new mongoose.Types.ObjectId("6854ffe193a2cab5ddcba4cf");
    } else if (specialGrocery == "All") {
        // No additional filters needed for all products
    } else {
        return res.status(400).json({
            success: false,
            message: "Invalid special grocery type"
        });
    }

    const query = { ...queryCommon, ...queryFilters, isDeleted: false };

    const productsRaw = await VendorProduct.find(query).populate("shopId", "name lat long")


    res.status(200).json({
        success: true,
        message: "Home data fetched successfully",
        count: productsRaw.length,
        data: productsRaw.map(formatProduct),
    });
});
