const razorpay = require("../../../utils/razorpayInstance");


const createRazorpayOrder = async (req, res) => {
    try {
        const { amount } = req.body; // amount in rupees

        if (!amount) return res.status(400).json({ success: false, message: "Amount is required" });

        const options = {
            amount: amount * 100, // amount in paise
            currency: "INR",
            receipt: "gorabitid_" + Math.floor(Math.random() * 10000),
        };

        const order = await razorpay.orders.create(options);

        return res.status(200).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error) {
        console.error("Razorpay order error:", error);
        return res.status(500).json({ success: false, message: "Payment initiation failed", error: error.message });
    }
};

module.exports = createRazorpayOrder;
