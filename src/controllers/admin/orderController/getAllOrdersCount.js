const Order = require("../../../models/order");

const getAllOrdersCount = async (req, res) => {
    try {
        // Aggregate count by orderStatus
        const countsArray = await Order.aggregate([
            {
                $group: {
                    _id: "$orderStatus",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Initialize result object with all expected statuses
        const counts = {
            pending: 0,
            accepted: 0,
            ready: 0,
            shipped: 0,          // Assigned
            out_for_delivery: 0, // Running
            delivered: 0,
            cancelled: 0,
            all: 0               // Will be added below
        };

        // Fill actual counts from DB aggregation
        countsArray.forEach(({ _id, count }) => {
            if (counts[_id] !== undefined) {
                counts[_id] = count;
            }
        });

        // Get total orders
        const total = await Order.countDocuments();
        counts.all = total;

        return res.status(200).json({
            success: true,
            counts
        });
    } catch (error) {
        console.error("Error counting orders:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch order counts",
            error: error.message
        });
    }
};

module.exports = getAllOrdersCount;
