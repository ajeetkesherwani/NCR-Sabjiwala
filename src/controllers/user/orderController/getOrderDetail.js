const Order = require("../../../models/order");

const getOrderDetail = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId)
            .populate("productData.product_id")
            .populate("userId")
            .populate("addressId")
            .populate("assignedDriver")
            .populate("shopId")
            .populate("vendorId");

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        const shopLocation = order.shopId?.location || null;
        const userLocation = order.userId?.location || null;

        const {
            productData,
            addressId,
            assignedDriver,
            shopId,
            userId
        } = order;

        let distanceKm = null;
        let estimatedTimeMin = null;
        const AVERAGE_SPEED_KMH = 40;

        // Calculate distance and time only if driver assigned AND shop & user locations exist
        // if (assignedDriver && shopLocation && userLocation) {
        //     const [shopLng, shopLat] = shopLocation.coordinates;
        //     const [userLng, userLat] = userLocation.coordinates;

        //     distanceKm = getDistanceFromLatLonInKm(shopLat, shopLng, userLat, userLng);
        //     estimatedTimeMin = (distanceKm / AVERAGE_SPEED_KMH) * 60;
        // }

        // Build response data depending on whether driver is assigned

        const orderStatus = order.orderStatus || "pending";


        const responseData = {
            serviceType: productData?.product_id?.type || "N/A",
            productName: productData?.product_id?.name || "N/A",
            shopName: order.shopId?.name || "N/A",
            shopLocation: order.shopId.location ? `${order.shopId.location.coordinates[1]}, ${order.shopId.location.coordinates[0]}` : "N/A",
            userName: order.userId?.name || "N/A",
            orderStatus,
            orderStatusMessage: getOrderStatusMessage(orderStatus),
            deliveryLocation: `${addressId?.address1 || ''}, ${addressId?.address2 || ''}, ${addressId?.city || ''}, ${addressId?.state || ''}, ${addressId?.pincode || ''}`.replace(/(, )+/g, ', ').trim(),
            driverName: assignedDriver ? assignedDriver.name : "Not assigned yet",
            driverMobile: assignedDriver ? assignedDriver.mobileNo : "Not assigned yet",
            driverImage: assignedDriver ? assignedDriver.image : null,
            driverLocation: assignedDriver ? assignedDriver.location : null,
            userLocation: userLocation,
            shopLocation: shopLocation,
            // distanceKm: distanceKm !== null ? distanceKm.toFixed(2) : null,
            // estimatedTimeMin: "20 min",
            // estimatedTimeMin: estimatedTimeMin !== null ? estimatedTimeMin.toFixed(0) : null,
        };

        return res.status(200).json({
            success: true,
            // order,
            data: responseData
        });

    } catch (error) {
        console.error("Error fetching order details:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

function getOrderStatusMessage(status) {
    const statusMessages = {
        pending: "Order created, waiting for acceptance",
        accepted: "Vendor accepted the order",
        preparing: "Vendor is preparing the order",
        ready: "Order is ready, waiting for delivery pickup",
        shipped: "Order is picked up by delivery person",
        running: "Order is on the way to you",
        "out of delivery": "Order is out for delivery",
        delivered: "Order has been delivered",
        cancelled: "Order has been cancelled",
    };

    return statusMessages[status] || "Unknown status";
}

// function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
//     const R = 6371; // Radius of the Earth in km
//     const dLat = deg2rad(lat2 - lat1);
//     const dLon = deg2rad(lon2 - lon1);
//     const a =
//         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//         Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
//         Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     const distance = R * c; // Distance in km
//     return distance;
// }

// function deg2rad(deg) {
//     return deg * (Math.PI / 180);
// }

module.exports = getOrderDetail;
