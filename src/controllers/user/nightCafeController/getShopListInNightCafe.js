const Category = require("../../../models/category");
const Shop = require("../../../models/shop");
const VendorProduct = require("../../../models/vendorProduct");
const { calculateOffer } = require("../../../utils/calculateOffer");
const catchAsync = require("../../../utils/catchAsync");

exports.getShopListInNightCafe = catchAsync(async (req, res) => {

    const cafeList = await Shop.find({ isNightCafe: true, isClose: false, status: "active" }).sort({ createdAt: -1 });

    const cafes = cafeList.map(cafe => ({
        _id: cafe._id,
        name: cafe.name || "",
        image: cafe.shopImage || "",
        address: cafe.address,
        time: cafe.deliveryTime || "15 min",
        distance: cafe.distance || "3 km",
        rating: cafe.rating || 4.0,
        offer: cafe.offer || "50% OFF"
    }));

    return res.status(200).json({
        status: true,
        cafes
    });
});