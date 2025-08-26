const Category = require("../../../models/category");
const Toppins = require("../../../models/toppins");
const User = require("../../../models/user");
const Vendor = require("../../../models/vendor");
const VendorProduct = require("../../../models/vendorProduct");
const { calculateOffer } = require("../../../utils/calculateOffer");
const catchAsync = require("../../../utils/catchAsync");

exports.getsubCategoryList = catchAsync(async (req, res, next) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const categoryId = req.params.categoryId;
        const subCategoryList = await Category.find({ cat_id: categoryId });

        if (!subCategoryList || subCategoryList.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No sub-categories found for this category",
            });
        }

        const subCategoryData = subCategoryList.map((cat) => ({
            _id: cat._id,
            cat_id: cat.cat_id,
            name: cat.name,
            image: cat.image,
        }));

        return res.status(200).json({
            success: true,
            message: "Subcategory List retrieved successfully",
            subCategoryData,
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
