const newOrder = require("../../../models/newOrder");

exports.getNewOrder = async (req, res) => {
    try {
        const type = req.query.type;

        // Get start and end of today (local time)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        let filter = {};

        // if (type === "today") {
        //     filter.deliveryDate = { $gte: today, $lt: tomorrow };
        // } else if (type === "previous") {
        //     filter.deliveryDate = { $lt: today };
        // }

        if (type === "today") {
            filter.orderStatus = { $in: ["pending", "accepted", "preparing", "ready", "out_for_delivery"] };
        } else if (type === "previous") {
            filter.orderStatus = { $in: ["delivered", "cancelled"] };
        }

        let orders = await newOrder.find(filter)
            .populate("productData.productId", "name primary_image vendorSellingPrice shortDescription")
            .populate("couponId")
            .populate("addressId")
            .populate("shopId", "name location shopImage")
            .populate("vendorId", "name email")
            .populate("assignedDriver", "name")
            .sort({ createdAt: -1 });


        return res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};