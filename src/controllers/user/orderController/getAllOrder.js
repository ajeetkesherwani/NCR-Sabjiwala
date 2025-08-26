const Order = require("../../../models/order");

const getAllOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderStatus } = req.query;

    // Base filter
    const filter = { userId };

    if (orderStatus === "active") {
      filter.orderStatus = { $nin: ["delivered", "cancelled"] };
    } else if (orderStatus === "completed") {
      filter.orderStatus = { $in: ["delivered", "cancelled"] };
    } else if (orderStatus !== "all") {
      return res.status(400).json({ success: false, message: "Invalid order status" });
    }
    // if orderStatus === 'all', we leave filter as just { userId }

    const orders = await Order.find(filter)
      .populate("productData.product_id")
      .populate("couponId")
      .populate("addressId")
      .populate("shopId", "name location packingCharge")
      .populate("vendorId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

module.exports = getAllOrder;
