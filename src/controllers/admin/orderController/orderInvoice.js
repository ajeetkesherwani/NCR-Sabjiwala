
const path = require('path');
const Order = require('../../../models/order');
const generateInvoice = require('../../../utils/invoiceGenerator');

const orderInvoice = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId)
            .populate("items.productId")
            .populate("userId", "name email")
            .populate("deliveryAddressId")

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        // return res.status(404).json({ order });

        const filePath = path.join(__dirname, `../../../invoices/invoice-${orderId}.pdf`);
        await generateInvoice(order, filePath);

        res.download(filePath, `invoice-${order.booking_id}.pdf`, err => {
            if (err) {
                console.error("Download error:", err);
                res.status(500).send("Failed to download invoice");
            }
        });
        // res.sendFile(filePath);
    } catch (err) {
        console.error("Error generating invoice:", err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

module.exports = orderInvoice;