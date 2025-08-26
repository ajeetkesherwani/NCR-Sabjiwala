const Shop = require("../../../models/shop");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.shopDetails = catchAsync(async (req, res, next) => {

    let shopId = req.params.id

    const shop = await Shop.findOne({_id: shopId});

    if(!shop) return next(new AppError("Shop is not found", 404));

    return res.status(201).json({
        success: true,
        message: "Shop details",
        shop: shop
    });

})