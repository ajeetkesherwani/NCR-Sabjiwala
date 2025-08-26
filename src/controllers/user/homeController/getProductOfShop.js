const User = require("../../../models/user");
const VendorProduct = require("../../../models/vendorProduct");
const { calculateOffer } = require("../../../utils/calculateOffer");
const catchAsync = require("../../../utils/catchAsync");


const formatProduct = (prod) => ({
    _id: prod._id,
    name: prod.name,
    vendorId: prod.vendorId,
    shopId: prod.shopId._id,
    shortDescription: prod.shortDescription,
    primary_image: prod.primary_image,
    price: prod.vendorSellingPrice,
    mrp: prod.mrp,
    offer: calculateOffer(prod.mrp, prod.vendorSellingPrice),
    isRecommended: prod.isRecommended,
});

exports.getProductOfShop = catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    const shopId = req.params.shopId;
    const typeFilter = user.userType === "veg" ? { type: "veg" } : {};

    const productsRaw = await VendorProduct.find({
        status: "active",
        shopId,
        ...typeFilter,
        isDeleted: false
    });

    if (!productsRaw.length) {
        return res.status(404).json({
            success: false,
            message: "No products found",
        });
    }

    const products = productsRaw.sort((a, b) => (b.isRecommended === true) - (a.isRecommended === true)).map(formatProduct);

    res.status(200).json({
        success: true,
        message: "Products retrieved successfully",
        length: products.length,
        data: products,
    });
});
