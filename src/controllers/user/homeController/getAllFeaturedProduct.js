const Category = require("../../../models/category");
const User = require("../../../models/user");
const VendorProduct = require("../../../models/vendorProduct");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllFeaturedProduct = catchAsync(async (req, res, next) => {
    try {

        const userId = req.user._id;
        const serviceId = req.query.serviceId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const userType = user.userType;


        const products = await VendorProduct.find({ status: "active", type: userType, serviceId }).limit(10).populate("shopId");

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