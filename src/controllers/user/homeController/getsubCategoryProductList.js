const Category = require("../../../models/category");
const User = require("../../../models/user");
const Vendor = require("../../../models/vendor");
const VendorProduct = require("../../../models/vendorProduct");
const { calculateOffer } = require("../../../utils/calculateOffer");
const catchAsync = require("../../../utils/catchAsync");

exports.getsubCategoryProductList = catchAsync(async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const subCategoryId = req.params.subCategoryId;

        const productList = await VendorProduct.find({ subCategoryId: subCategoryId, isDeleted: false });

        if (!productList || productList.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No product list found for this sub-category",
            });
        }

        const productData = productList.map((prod) => ({
            _id: prod._id,
            subCategoryId: prod.subCategoryId,
            name: prod.name,
            shopId: prod.shopId,
            vendorId: prod.vendorId,
            image: prod.primary_image,
            shortDescription: prod.shortDescription,
            vendorSellingPrice: prod.vendorSellingPrice,
            sellingUnit: prod.sellingUnit,
        }));

        return res.status(200).json({
            success: true,
            message: "Product List retrieved successfully",
            productData,
        });
    } catch (error) {
        console.error("Error in get sub category data controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
});
