const Category = require("../../../models/category");
const User = require("../../../models/user");
const VendorProduct = require("../../../models/vendorProduct");
const { calculateOffer } = require("../../../utils/calculateOffer");
const catchAsync = require("../../../utils/catchAsync");

exports.getProductOfCategory = catchAsync(async (req, res, next) => {
    try {

        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const userType = user.userType;

        const categoryId = req.params.categoryId;

        const productsRaw = await VendorProduct.find({ status: "active", type: userType, categoryId, isDeleted: false }).populate("shopId", "name");

        const products = productsRaw.map((prod) => ({
            _id: prod._id,
            name: prod.name,
            vendorId: prod.vendorId,
            shopId: prod.shopId._id,
            primary_image: prod.primary_image,
            price: prod.vendorSellingPrice,
            mrp: prod.mrp,
            offer: calculateOffer(prod.mrp, prod.vendorSellingPrice)
        }));

        if (!products || products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No products found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Products retrieved successfully',
            length: products.length,
            data: products
        });

    } catch (error) {
        console.error('Error in get category controller:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
})