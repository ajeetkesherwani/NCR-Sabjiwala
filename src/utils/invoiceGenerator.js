const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateInvoice = async (order, filePath) => {
    return new Promise((resolve, reject) => {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const doc = new PDFDocument({ margin: 50 });
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // 🧾 Header
        doc.fontSize(24).fillColor('#333').text('Sabziwala Invoice', { align: 'center' });
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();

        // 🧾 Order Info
        doc.fontSize(14).fillColor('black').text(`Order ID: ${order.orderId}`);
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
        doc.text(`Customer: ${order.userId?.name} (${order.userId?.email})`);
        doc.moveDown();

        // 📍 Delivery Address
        if (order.deliveryAddressId) {
            doc.fontSize(12).text('Delivery Address:');
            doc.fontSize(11)
                .text(order.deliveryAddressId.name)
                .text(order.deliveryAddressId.address1)
                .text(order.deliveryAddressId.address2 || '')
                .text(`${order.deliveryAddressId.city}, ${order.deliveryAddressId.state} - ${order.deliveryAddressId.pincode}`);
            doc.moveDown();
        }

        // 📦 Items Header
        doc.fontSize(14).fillColor('#000').text('Order Items', { underline: true });
        doc.moveDown(0.5);

        const startX = 50;
        let y = doc.y;
        const rowHeight = 20;

        doc.fontSize(11).fillColor('#555');
        doc.text('S.No', startX, y);
        doc.text('Product', startX + 40, y);
        doc.text('Qty', startX + 190, y);
        doc.text('Unit', startX + 230, y);
        doc.text('Original', startX + 270, y);
        doc.text('Discount', startX + 340, y);
        doc.text('Price', startX + 410, y);
        doc.text('Final', startX + 470, y);

        y += rowHeight;
        doc.moveTo(startX, y - 5).lineTo(550, y - 5).stroke();

        // 📦 Items Rows
        order.items.forEach((item, i) => {
            doc.fontSize(10).fillColor('#000');
            doc.text(i + 1, startX, y);
            doc.text(item.name, startX + 40, y, { width: 140 });
            doc.text(item.quantity, startX + 190, y);
            doc.text(item.unit, startX + 230, y);
            doc.text(`Rs.${item.originalPrice.toFixed(2)}`, startX + 270, y);
            doc.text(`${item.discount}%`, startX + 340, y);
            doc.text(`Rs.${item.price.toFixed(2)}`, startX + 410, y);
            doc.text(`Rs.${item.finalPrice.toFixed(2)}`, startX + 470, y);

            y += rowHeight;
            if (y > 700) {
                doc.addPage();
                y = 50;
            }
        });

        doc.moveDown(2);

        // 💰 Charges Summary
        doc.fontSize(13).fillColor('#000').text('Summary & Charges', 400, doc.y, { align: 'right', underline: true });
        doc.moveDown(0.5);

        const charges = [
            { label: 'Item Total', value: order.itemTotal },
            { label: 'Packing Charge', value: order.packingCharge },
            { label: 'Delivery Charge', value: order.deliveryCharge },
            { label: 'Coupon Discount', value: -order.couponDiscount },
        ];

        charges.forEach(c => {
            doc.fontSize(11)
                .text(c.label, 350, doc.y, { continued: true })
                .text(`Rs.${c.value.toFixed(2)}`, { align: 'right' });
            doc.moveDown(0.3);
        });

        doc.moveDown(0.5);
        doc.fontSize(13).font('Helvetica-Bold')
            .text('Final Total:', 350, doc.y, { continued: true })
            .text(`Rs.${order.finalAmount.toFixed(2)}`, { align: 'right' });

        doc.font('Helvetica').moveDown();

        // 🔻 Footer Info
        doc.fontSize(11).fillColor('#333');
        doc.text(`Payment Mode: ${order.paymentMode?.toUpperCase()}`, 350);
        doc.text(`Payment Status: ${order.paymentStatus}`, 350);
        doc.text(`Order Status: ${order.orderStatus}`, 350);
        doc.text(`Delivery Date: ${new Date(order.deliveryDate).toLocaleDateString()}`, 350);

        doc.end();

        stream.on('finish', () => resolve(filePath));
        stream.on('error', reject);
    });
};

module.exports = generateInvoice;
