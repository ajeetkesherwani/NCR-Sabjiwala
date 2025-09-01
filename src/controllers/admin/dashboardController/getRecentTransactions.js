const catchAsync = require("../../../utils/catchAsync");
const Order = require("../../../models/order")

exports.getRecentTransactions = catchAsync(async (req, res) => {
    try {

        const order = await Order.find().select("orderId finalAmount orderStatus").sort({ createdAt: -1 }).limit(15);

        return res.status(200).json({
            status: true,
            message: "Recent transactions fetched successfully",
            data: order
        });

    } catch (error) {
        return res.status(500).json({ status: false, message: "Something went wrong", error: error.message });
    }
});