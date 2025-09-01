const Category = require("../../../models/category");
const User = require("../../../models/user");
const catchAsync = require("../../../utils/catchAsync");

exports.getNightCafeShopOfCategory = catchAsync(async (req, res, next) => {
    try {

        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const userType = user.userType;
        const typeFilter = user.userType === "veg" ? { type: "veg" } : {}; 

        const categoryId = req.params.categoryId;

        const products = await VendorProduct.find({ status: "active", categoryId, ...typeFilter }).populate("shopId");

        if (!products || products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No products found'
            });
        }

        const uniqueShopsMap = new Map();
        products.forEach((p) => {
            if (p.shopId && p.shopId.isNightCafe == true && !uniqueShopsMap.has(p.shopId._id.toString())) {
                uniqueShopsMap.set(p.shopId._id.toString(), {
                    _id: p.shopId._id,
                    name: p.shopId.name,
                    shopImage: p.shopId.shopImage,
                    address: p.shopId.address,
                    time: "15",
                    distance: "3",
                })
            }
        })

        const uniqueShops = Array.from(uniqueShopsMap.values());


        return res.status(200).json({
            success: true,
            message: 'Products retrieved successfully',
            length: uniqueShops.length,
            data: uniqueShops
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