const Order = require("../../../models/order");
const catchAsync = require("../../../utils/catchAsync");

exports.orderComplete = catchAsync(async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ status: false, message: "Order not found" });

        res.status(200).json({
            status: true,
            message: "Working on this",
        });
    } catch (error) {
        console.error("Order Complete Error:", error);
        return res.status(500).json({ success: false, message: "Server error while order complete.", error: error.message });
    }
});
