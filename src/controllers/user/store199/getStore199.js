const Explore = require("../../../models/explore");
const exploreSection = require("../../../models/exploreSection");
const store199Product = require("../../../models/store199Product");
const VendorProduct = require("../../../models/vendorProduct");
const AppError = require("../../../utils/AppError");
const { calculateOffer } = require("../../../utils/calculateOffer");
const catchAsync = require("../../../utils/catchAsync");

const formatProduct = (prod) => ({
    _id: prod._id,
    name: prod.name,
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
exports.getStore199 = catchAsync(async (req, res) => {


    // const allProductRaw = await store199Product.find({ status: "active" }).sort({ createdAt: -1 }).populate(["categoryId", "brandId", "vendorId"]).populate({ path: "subCategoryId", model: "Category" });
    // if (allProductRaw.length == 0) {
    //     return res.status(200).json({
    //         status: "false",
    //         message: "No product found"
    //     });
    // }

    const allProductRaw = await VendorProduct.find({ vendorSellingPrice: 199, status: "active", isDeleted: false }).sort({ createdAt: -1 }).populate(["categoryId", "brandId", "vendorId"]);
    if (allProductRaw.length == 0) {
        return res.status(200).json({
            status: "false",
            message: "No product found"
        });
    }


    // const allProduct = allProductRaw.map((prod) => {
    //     return {
    //         _id: prod._id,
    //         name: prod.name,
    //         shopName: prod.shopId?.name || "",
    //         primary_image: prod.primary_image,
    //         shortDescription: prod.shortDescription,
    //         price: prod.vendorSellingPrice,
    //         mrp: prod.mrp,
    //         offer: calculateOffer(prod.mrp, prod.vendorSellingPrice),
    //         distance: "3",
    //         time: "5"
    //     };
    // });

    // const pageData = {
    //     name: "Store199",
    //     "bannerImg": "public\\banners/banners-1747284987791-8848.png",
    //     "couponCode": "B1G1"
    // }

    const allProduct = allProductRaw.map((prod) => ({
        _id: prod._id,
        name: prod.name,
        image: prod.primary_image,
        shortDescription: prod.shortDescription,
        vendorSellingPrice: prod.vendorSellingPrice,
        sellingUnit: prod.sellingUnit,
    }));

    return res.status(200).json({
        status: "true",
        results: allProduct.length,
        data: allProduct
    });
});