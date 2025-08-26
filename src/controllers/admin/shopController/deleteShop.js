const Shop = require("../../../models/shop");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.deleteShop = catchAsync(async (req, res, next) => {
    try {
        const { shopId } = req.params;

        if (!shopId) return next(new AppError("Shop ID is required.", 404));

        const shop = await Shop.findById(shopId);
        if (!shop) return next(new AppError("Shop not found.", 404));

        await Shop.findByIdAndDelete(shopId);
        return res.status(200).json({
            success: true,
            message: "Shop deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong", status: "notsuccess", error: error.message });
    }
});