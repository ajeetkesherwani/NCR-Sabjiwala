const VendorProduct = require("../../../models/vendorProduct");
const catchAsync = require("../../../utils/catchAsync");
const { FOOD_SERVICE_ID, MART_SERVICE_ID } = require("../../../utils/constants");

exports.getAllProductFlag = catchAsync(async (req, res) => {

    // 67ecc79120a93fc0b92a8b19 - food
    // 67ecc79a20a93fc0b92a8b1b - grocery
    let { type } = req.query;

    if (!type) {
        return res.status(400).json({
            status: false,
            message: "Type is required"
        })
    }

    let serviceId;

    if (type == 'food') {
        serviceId = FOOD_SERVICE_ID;
    } else if (type == 'grocery') {
        serviceId = MART_SERVICE_ID;
    }

    const allProductRaw = await VendorProduct.find({ serviceId, isDeleted: false }).select("name primary_image isRecommended isFeatured isFruitOfTheDay isSeasonal isVegetableOfTheDay").sort({ createdAt: -1 }).populate("vendorId", "name").populate("shopId", "name").sort({ createdAt: -1 })

    const allProduct = allProductRaw.map(product => {
        return {
            _id: product._id,
            name: product.name,
            primary_image: product.primary_image,
            isRecommended: product.isRecommended,
            isFeatured: product.isFeatured,
            isFruitOfTheDay: product.isFruitOfTheDay,
            isSeasonal: product.isSeasonal,
            isVegetableOfTheDay: product.isVegetableOfTheDay,
            vendorName: product.vendorId ? product.vendorId.name : "N/A",
            shopName: product.shopId ? product.shopId.name : "N/A"
        }
    })

    return res.status(200).json({
        status: true,
        count: allProduct.length,
        type,
        data: allProduct
    })

})