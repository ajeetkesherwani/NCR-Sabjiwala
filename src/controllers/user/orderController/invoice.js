const Order = require('../../../models/order');
const generateInvoice = require('../../../utils/invoiceGenerator');
const path = require('path');

const getInvoicePdf = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId)
            .populate('userId')
            .populate('shopId')
            .populate('productData.product_id');

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

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

module.exports = getInvoicePdf;
