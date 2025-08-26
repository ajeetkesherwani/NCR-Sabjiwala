
const Driver = require("../../../models/driver");
const order = require("../../../models/order");
const OrderAssign = require("../../../models/orderAssign");
const catchAsync = require("../../../utils/catchAsync");
const sendPushNotification = require("../../../utils/sendPushNotification");

exports.assignedDriver = catchAsync(async (req, res, next) => {
    try {
        const { orderId } = req.params;

        const { driverId } = req.body;
        if (!driverId) {
            return res.status(400).json({ success: false, message: "Chooese Driver" });
        }

        const driver = await Driver.findById(driverId);

        if (driver.currentOrderId) {
            return res.status(400).json({ success: false, message: "Driver is already assigned to another order" });
        }

        const Order = await order.findById(orderId);

        new OrderAssign({
            orderId: Order._id,
            driverId: driverId
        }).save();

        Order.assignedDriver = driverId;
        Order.orderStatus = "shipped";
        driver.currentOrderId = Order._id;

        await Order.save();
        await driver.save();

        // Send push notification to the driver
        const deviceToken = driver.deviceToken;
        const notificatonTitle = "New Order Assigned";
        const notificatonBody = `You have been assigned a new order with ID: ${Order._id}. Please check your app for details.`;
        sendPushNotification({ deviceToken, title: notificatonTitle, body: notificatonBody });

        return res.status(200).json({ success: true, message: "Order Assigned", order });
    } catch (error) {
        console.error("Error updating order status:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
});
