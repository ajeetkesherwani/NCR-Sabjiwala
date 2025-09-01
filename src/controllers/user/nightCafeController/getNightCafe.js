const Category = require("../../../models/category");
const { calculateOffer } = require("../../../utils/calculateOffer");
const catchAsync = require("../../../utils/catchAsync");
const { FOOD_SERVICE_ID } = require("../../../utils/constants");

exports.getNightCafe = catchAsync(async (req, res) => {
    const pageData = {
        name: "Night Cafe",
        bannerImg: "public/banners/banner-night-cafe.png",
        promoText: "Hunger Never Sleeps, Neither Do We!",
    };

    const cafeList = await Shop.find({ isNightCafe: true, isClose: false, status: "active" }).sort({ createdAt: -1 }).limit(5);
    const categoryList = await Category.find({ serviceId: FOOD_SERVICE_ID }).select("name image").sort({ createdAt: -1 });
    const productList = await VendorProduct.find({
        serviceId: FOOD_SERVICE_ID,
        status: "active",
        $or: [
            { isRecommended: true },
            { isFeatured: true }
        ]
    })
        .populate("shopId", "name shopImage")
        .sort({ createdAt: -1 }).limit(20);

    const cafes = cafeList.map(cafe => ({
        _id: cafe._id,
        name: cafe.name || "",
        image: cafe.shopImage || "",
        time: cafe.deliveryTime || "15 min",
        distance: cafe.distance || "3 km",
        rating: cafe.rating || 4.0,
        offer: cafe.offer || "50% OFF"
    }));

    const cravings = categoryList.map(cat => ({
        _id: cat._id,
        name: cat.name || "",
        image: cat.image || "public/images/default-category.png"
    }));

    const specials = cafeList.map(cafe => ({
        _id: cafe._id,
        name: cafe.name || "",
        image: cafe.shopImage || "",
        offer: cafe.offer || "50% OFF"
    }));

    const trending = productList.map(prod => ({
        _id: prod._id,
        name: prod.name || "",
        shopId: prod.shopId?._id || "",
        vendorId: prod.vendorId || "",
        shopName: prod.shopId?.name || "",
        primary_image: prod.primary_image || "public/images/default-product.png",
        price: prod.vendorSellingPrice || 0,
        mrp: prod.mrp || 0,
        offer: calculateOffer(prod.mrp, prod.vendorSellingPrice),
        label: prod.isRecommended ? "RECOMMENDED" : (prod.isFeatured ? "FEATURED" : "")
    }));

    return res.status(200).json({
        status: true,
        pageData,
        cafes,
        cravings,
        specials,
        trending
    });
});



// const cafes = [
//     {
//         _id: "1",
//         name: "Sky night cafe",
//         image: "public/images/sky-night-cafe.jpg",
//         time: "15 min",
//         distance: "3 km",
//         rating: 4.2,
//         offer: "50% OFF"
//     },
//     {
//         _id: "2",
//         name: "Night city cafe",
//         image: "public/images/night-city-cafe.jpg",
//         time: "15 min",
//         distance: "3 km",
//         rating: 4.2,
//         offer: "50% OFF"
//     },
//     {
//         _id: "3",
//         name: "Dream Night Cafe",
//         image: "public/images/dream-night-cafe.jpg",
//         time: "15 min",
//         distance: "3 km",
//         rating: 4.0,
//         offer: "50% OFF"
//     }
// ];

// const cravings = [
//     { id: "1", name: "Pizza", icon: "public/icons/pizza.png" },
//     { id: "2", name: "Burger", icon: "public/icons/burger.png" },
//     { id: "3", name: "Noodles", icon: "public/icons/noodles.png" },
//     { id: "4", name: "Dessert", icon: "public/icons/dessert.png" },
// ];

// const specials = [
//     {
//         _id: "1",
//         name: "Burger King",
//         image: "public/images/burger-king.png",
//         offer: "50% OFF"
//     },
//     {
//         _id: "2",
//         name: "La Pinoz",
//         image: "public/images/la-pinoz.png",
//         offer: "60% OFF"
//     },
//     {
//         _id: "3",
//         name: "KFC",
//         image: "public/images/kfc.png",
//         offer: "45% OFF"
//     }
// ];

// const trending = [
//     {
//         _id: "1",
//         name: "Cold Coffee",
//         shopName: "Coffee",
//         primary_image: "public/images/cold-coffee.png",
//         price: 150,
//         mrp: 200,
//         offer: calculateOffer(200, 150),
//         label: "BESTSELLER"
//     },
//     {
//         _id: "2",
//         name: "Strawberry Shake",
//         shopName: "Sprite",
//         primary_image: "public/images/strawberry-shake.png",
//         price: 170,
//         mrp: 220,
//         offer: calculateOffer(220, 170),
//         label: "BESTSELLER"
//     }
// ];