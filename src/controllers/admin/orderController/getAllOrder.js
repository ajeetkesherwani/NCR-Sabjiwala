const Order = require("../../../models/order");


const getAllOrder = async (req, res) => {
    try {
        const { orderStatus } = req.query;

        // Base filter
        const filter = {};

        switch (orderStatus) {
            case "pending":
                filter.orderStatus = "pending";
                break;
            case "accepted":
                filter.orderStatus = "accepted";
                break;
            case "ready":
                filter.orderStatus = "ready";
                break;
            case "shipped":
                filter.orderStatus = "shipped";
                break;
            case "running":
                filter.orderStatus = "running";
                break;
            case "delivered":
                filter.orderStatus = "delivered";
                break;
            case "cancelled":
                filter.orderStatus = "cancelled";
                break;
            case "all":
                // No additional filter needed for 'all'
                break;
        }

        const orders = await Order.find(filter)
            .populate("items.productId")
            .populate("deliveryAddressId")
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

module.exports = getAllOrder;
