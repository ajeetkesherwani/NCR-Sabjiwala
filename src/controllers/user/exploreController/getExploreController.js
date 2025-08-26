const Explore = require("../../../models/explore");
const exploreSection = require("../../../models/exploreSection");
const { calculateOffer } = require("../../../utils/calculateOffer");
const catchAsync = require("../../../utils/catchAsync");

const formatProduct = (prod) => ({
    _id: prod._id,
    name: prod.name,
    shopId: prod.shopId._id,
    vendorId: prod.vendorId,
    shopName: prod.shopId?.name || "",
    primary_image: prod.primary_image,
    shortDescription: prod.shortDescription,
    price: prod.vendorSellingPrice,
    mrp: prod.mrp,
    offer: calculateOffer(prod.mrp, prod.vendorSellingPrice),
    distance: "3",
    time: "5"
});

// Get Single
exports.getExplore = catchAsync(async (req, res) => {
    const exploreId = req.params.exploreId
    const explore = await Explore.findById(exploreId).select("name bannerImg couponCode");
    if (!explore) throw new AppError("Explore not found", 404);

    const exploreSectionsRaw = await exploreSection.find({ exploreId: exploreId }).select("name products").populate({ path: "products" });
    if (!exploreSectionsRaw || exploreSectionsRaw.length === 0) {
        return res.status(404).json({
            status: false,
            message: "No sections found for this explore"
        });
    }

    const exploreSections = exploreSectionsRaw.map((section) => {
        return {
            _id: section._id,
            name: section.name,
            products: section.products.slice(0,5).map(product => formatProduct(product))
        }
    });

    return res.status(200).json({
        status: true,
        explore,
        exploreSections
    });
});