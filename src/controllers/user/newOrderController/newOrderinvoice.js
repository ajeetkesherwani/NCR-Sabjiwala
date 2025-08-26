const newOrder = require('../../../models/newOrder');
const generateInvoice = require('../../../utils/invoiceGenerator');
const path = require('path');

const newOrderinvoicePDF = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await newOrder.findById(orderId)
            .populate("productData.productId") // Note: productId instead of product_id
            .populate("productData.toppings.toppingId") // Populate toppings if needed
            .populate("userId", "name email")
            .populate("addressId")
            .populate("couponId")
            .populate("shopId", "name location packingCharge")
            .populate("assignedDriver", "name")
            .populate("vendorId", "name email");

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

module.exports = newOrderinvoicePDF;


// const Order = require('../../../models/order');
// const generateInvoice = require('../../../utils/invoiceGenerator');
// const path = require('path');

// const newOrderinvoicePDF = async (req, res) => {
//     try {
//         const { orderId } = req.params;
//         const order = await Order.findById(orderId)
//             .populate('userId')
//             .populate('shopId')
//             .populate('productData.product_id');

//         if (!order) {
//             return res.status(404).json({ success: false, message: 'Order not found' });
//         }

//         const filePath = path.join(__dirname, `../../../invoices/invoice-${orderId}.pdf`);
//         await generateInvoice(order, filePath);

//         res.download(filePath, `invoice-${order.booking_id}.pdf`, err => {
//             if (err) {
//                 console.error("Download error:", err);
//                 res.status(500).send("Failed to download invoice");
//             }
//         });
//         // res.sendFile(filePath);
//     } catch (err) {
//         console.error("Error generating invoice:", err);
//         res.status(500).json({ success: false, message: 'Server error', error: err.message });
//     }
// };

// module.exports = newOrderinvoicePDF;
