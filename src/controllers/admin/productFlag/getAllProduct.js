
const Product = require("../../../models/product");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllProductFlag = catchAsync(async (req, res) => {

    const allProductRaw = await Product.find().select("name primary_image isRecommended isFeatured isFruitOfTheDay isSeasonal isVegetableOfTheDay").sort({ createdAt: -1 }).populate("vendorId", "name").populate("shopId", "name").sort({ createdAt: -1 })

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