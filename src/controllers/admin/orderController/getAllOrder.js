const Order = require("../../../models/order");

const getAllOrder = async (req, res) => {
    try {
        const orderStatus = req.query.orderStatus;

        let ordersRaw;

        if (orderStatus === "all") {
            ordersRaw = await Order.find().populate("productData.product_id").populate("couponId").populate("addressId").populate("shopId", "name location packingCharge").populate("vendorId", "name email").populate("assignedDriver", "name").sort({ createdAt: -1 });
        } else {
            ordersRaw = await Order.find({ orderStatus }).populate("productData.product_id").populate("couponId").populate("addressId").populate("shopId", "name location packingCharge").populate("vendorId", "name email").populate("assignedDriver", "name").sort({ createdAt: -1 });
        }

        if (!ordersRaw || ordersRaw.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No orders found'
            });
        }

        const orders = ordersRaw.map((order) => ({
            _id: order._id,
            booking_id: order.booking_id,
            deliveryDate: order.deliveryDate,
            deliveryTime: order.deliveryTime,
            finalTotalPrice: order.finalTotalPrice,
            orderStatus: order.orderStatus,
            paymentMode: order.paymentMode,
            paymentStatus: order.paymentStatus,
            shopName: order.shopId.name,
            assignedDriver: order.assignedDriver ? order.assignedDriver.name : null,
        }));



        return res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

module.exports = getAllOrder;
