const Shop = require("../../../models/shop");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.statusShop = catchAsync(async (req, res, next) => {

    const shopId = req.params.id;
    let { status } = req.body;

    if (!shopId) return next(new AppError("Shop not found or unauthorized access.", 404));
    if (!status) return next(new AppError("Status is required.", 404));

    const shop = await Shop.findOneAndUpdate({ _id: shopId }, { $set: { status } }, { new: true });

    return res.status(201).json({
        success: true,
        message: "Shop status changed",
        shop: shop
    });

})