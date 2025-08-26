const Order = require("../../../models/order");
const catchAsync = require("../../../utils/catchAsync");

exports.getOrder = catchAsync(async (req, res, next) => {

    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId)
            .populate("productData.product_id") // Populate product info
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