const Order = require("../../../models/order");
const catchAsync = require("../../../utils/catchAsync");

exports.getOrder = catchAsync(async (req, res, next) => {

    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId)
            .populate("items.productId") // Populate product info
            .populate("userId", "name email") // Populate user info (select fields)
            .populate("deliveryAddressId") // Full address
            .populate("assignedDriver", "name")

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        return res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Error fetching order details:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
})