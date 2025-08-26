const mongoose = require("mongoose");
const Category = require("../../../models/category");
const Toppins = require("../../../models/toppins");
const User = require("../../../models/user");
const Vendor = require("../../../models/vendor");
const VendorProduct = require("../../../models/vendorProduct");
const { calculateOffer } = require("../../../utils/calculateOffer");
const catchAsync = require("../../../utils/catchAsync");

exports.getProductDetail = catchAsync(async (req, res, next) => {
    try {

        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const productId = req.params.productId;
        // test - 6848061dd9a8dae4b3b21c4b
        const product = await VendorProduct.findById({ _id: productId }).populate("shopId");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'No products found'
            });
        }

        const toppins = await Toppins.find({ productId: product._id, status: 'active' })

        const vendorId = product.vendorId;
        const vendor = await Vendor.findById({ _id: vendorId });
        const vendorName = vendor.name;
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'No products found'
            });
        }

        const productData = {
            _id: product._id,
            name: product.name,
            vendorName,
            vendorId: product.vendorId,
            shopId: product.shopId._id,
            primaryImage: product.primary_image,
            mrp: product.mrp,
            price: product.vendorSellingPrice,
            offer: calculateOffer(product.mrp, product.vendorSellingPrice),
            longDescription: product.longDescription,
            shopAddress: product.shopId.address,
            shopPincode: product.shopId.pincode,
            packingCharge: product.shopId.packingCharge,
        }


        return res.status(200).json({
            success: true,
            message: 'Product retrieved successfully',
            productData,
            toppins: toppins || []
        });

    } catch (error) {
        console.error('Error in get product details controller:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
})