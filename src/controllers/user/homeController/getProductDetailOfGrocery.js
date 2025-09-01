const Category = require("../../../models/category");
const User = require("../../../models/user");
const { calculateOffer } = require("../../../utils/calculateOffer");
const catchAsync = require("../../../utils/catchAsync");

exports.getProductDetailOfGrocery = catchAsync(async (req, res, next) => {
    try {

        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const productId = req.params.productId;

        const product = await VendorProduct.findById(productId).populate("shopId");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'No products found'
            });
        }
        const categoryId = product.categoryId;

        const productList = await VendorProduct.find({ categoryId }).limit(10)
        // const toppins = await Toppins.find({ status: 'active' })

        const vendorId = product.vendorId;
        const vendor = await Vendor.findById({ _id: vendorId });
        const vendorName = vendor.name;
        if (!productList) {
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
        }


        return res.status(200).json({
            success: true,
            message: 'Product retrieved successfully',
            productData,
            productList
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