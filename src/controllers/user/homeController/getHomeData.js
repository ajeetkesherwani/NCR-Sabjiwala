const { default: mongoose } = require("mongoose");
const banner = require("../../../models/dealBanner");
const Category = require("../../../models/category");
const Explore = require("../../../models/explore");
const Setting = require("../../../models/settings");
const User = require("../../../models/user");
const { calculateOffer } = require("../../../utils/calculateOffer");
const catchAsync = require("../../../utils/catchAsync");
const getDistanceAndTime = require("../../../utils/getDistanceAndTime");
const findNearbyShops = require("../../../utils/findNearbyShops");
const { FOOD_SERVICE_ID } = require("../../../utils/constants");
const Product = require("../../../models/product");
const ExploreSection = require("../../../models/exploreSection");
const ProductVarient = require("../../../models/productVarient");
const DealsBanner = require("../../../models/dealBanner");

const formatProduct = async (prod, userCoords, apiKey) => {
  const shopCoords = {
    lat: parseFloat(prod.shopId?.lat || 0),
    long: parseFloat(prod.shopId?.long || 0),
  };

  const { distance, time } = await getDistanceAndTime(
    userCoords,
    shopCoords,
    apiKey
  );

  const varients = await ProductVarient.find({ productId: prod._id }).select(
    "name price originalPrice discount stock unit images"
  );

  return {
    _id: prod._id,
    productName: prod.name || "",
    primary_image: prod.images,
    shortDescription: prod.shortDescription,
    price: prod.price,
    mrp: prod.mrp,
    ProductVarient: varients ? varients : [],
    reting: prod.rating || 4.5,
  };
};

exports.getHomeData = catchAsync(async (req, res) => {
  const serviceId = req.query.serviceId || "67ecc79120a93fc0b92a8b19";
  if (!serviceId)
    return res
      .status(400)
      .json({ success: false, message: "Service ID is required" });

  const setting = await Setting.findById("680f1081aeb857eee4d456ab");
  const apiKey = setting?.googleMapApiKey || "working";

  const user = await User.findById(req.user._id);
  const userCoords = {
    lat: parseFloat(user.lat || 0),
    long: parseFloat(user.long || 0),
  };
  const typeFilter = user.userType == "veg" ? { type: "veg" } : {};
  const commonQuery = { status: "active" };

  const [
    banners,
    categories,
    explore,
    recommendedRaw,
    featuredRaw,
    freshFood,
    dealBanner,
    limitedTimeProducts,
  ] = await Promise.all([
    banner.find({ serviceId }).select("image").sort({ createdAt: -1 }),
    Category.find({ cat_id: null })
      .select("name image")
      .limit(8)
      .sort({ createdAt: -1 }),
    ExploreSection.find({ exploreId: "68b31d5845a4e5225b56ce18" }).select(
      "name"
    ),
    Product.find({ ...commonQuery })
      .limit(10)
      .populate("categoryId", "name")
      .limit(10),
    Product.find({ ...commonQuery })
      .limit(10)
      .populate("categoryId", "name")
      .limit(10),
    Product.find({ ...commonQuery })
      .limit(10)
      .populate("categoryId", "name")
      .limit(10),
    DealsBanner.findOne({}).sort({ createdAt: -1 }).select("image"),
    Product.find({ ...commonQuery })
      .limit(10)
      .populate("categoryId", "name")
      .limit(10),
  ]);

  const frequentlyBoughtProducts = await Promise.all(
    recommendedRaw.map((p) => formatProduct(p, userCoords, apiKey))
  );

  const popularProducts = await Promise.all(
    featuredRaw.map((p) => formatProduct(p, userCoords, apiKey))
  );

  const freshFoodProducts = await Promise.all(
    freshFood.map((p) => formatProduct(p, userCoords, apiKey))
  );
  const limitedTimeDeals = await Promise.all(
    limitedTimeProducts.map((p) => formatProduct(p, userCoords, apiKey))
  );

  res.status(200).json({
    success: true,
    message: "Home data fetched successfully",
    data: {
      banners,
      categories,
      frequentlyBoughtProducts,
      explore,
      popularProducts,
      freshFoodProducts,
      dealBanner,
      limitedTimeDeals,
    },
  });
});
