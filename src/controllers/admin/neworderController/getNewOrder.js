const newOrder = require("../../../models/newOrder");
const catchAsync = require("../../../utils/catchAsync");

exports.getNewOrder = catchAsync(async (req, res, next) => {

    try {
        const { orderId } = req.params;

        const order = await newOrder.findById(orderId)
            .populate("productData.productId") // Populate product info
            .populate("userId", "name email") // Populate user info (select fields)
            .populate("addressId") // Full address
            .populate("couponId") // If applied
            .populate("shopId", "name location packingCharge") // Shop details
            .populate("assignedDriver", "name")
            .populate("vendorId", "name email"); // Vendor info

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        return res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Error fetching order details:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
})