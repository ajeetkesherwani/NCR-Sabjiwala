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

        // 🔷 Branding Header
        doc.fontSize(24).fillColor('#333').text('Gorabit', { align: 'center' });
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();

        // 🧾 Invoice Header
        doc.fontSize(14).fillColor('black').text(`Booking ID: ${order.booking_id}`);
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
        doc.text(`Customer: ${order.userId?.name} (${order.userId?.email})`);
        doc.text(`Shop: ${order.shopId?.name}`);
        doc.moveDown();

        // 📍 Address
        if (order.addressId) {
            doc.fontSize(12).text('Delivery Address:');
            doc.fontSize(11)
                .text(`${order.addressId.name}, ${order.addressId.address1}`)
                .text(`${order.addressId.address2}`)
                .text(`${order.addressId.city} - ${order.addressId.pincode}, ${order.addressId.state}`);
            doc.moveDown();
        }

        // 📦 Table Header
        doc.fontSize(14).fillColor('#000').text('Order Items', { underline: true });
        doc.moveDown(0.5);

        // Table Columns
        const startX = 50;
        let y = doc.y;
        const rowHeight = 20;

        doc.fontSize(11).fillColor('#555');
        doc.text('S.No', startX, y);
        doc.text('Product', startX + 40, y);
        doc.text('Qty', startX + 230, y);
        doc.text('Price', startX + 270, y);
        doc.text('Toppings', startX + 330, y);
        doc.text('Total', startX + 470, y);

        y += rowHeight;
        doc.moveTo(startX, y - 5).lineTo(550, y - 5).stroke();

        // Table Rows
        order.productData.forEach((item, i) => {
            const product = item.productId;
            let toppings = (item.toppings || [])
                .map(t => `${t.toppingId.name} (Rs.${t.price})`)
                .join(', ') || '-';

            doc.fontSize(10).fillColor('#000');
            doc.text(i + 1, startX, y);
            doc.text(product.name, startX + 40, y, { width: 180 });
            doc.text(item.quantity, startX + 230, y);
            doc.text(`Rs. ${item.price}`, startX + 270, y);
            doc.text(toppings, startX + 330, y, { width: 130 });
            doc.text(`Rs. ${item.finalPrice}`, startX + 470, y);

            y += rowHeight;
            if (y > 700) {  // handle page break
                doc.addPage();
                y = 50;
            }
        });

        doc.moveDown(2);

        // 💰 Charges Section (Improved Layout)
        // 💰 Charges Section (Enhanced Layout)
        doc.moveDown(2);
        doc.fontSize(13).fillColor('#000').text('Summary & Charges', 400, doc.y, { align: 'right', underline: true });
        doc.moveDown(0.5);

        const charges = [
            { label: 'Item Total', value: order.itemTotal },
            { label: 'Packing Charge', value: order.packingCharge },
            { label: 'Delivery Charge', value: order.deliveryCharge },
            { label: 'Coupon Discount', value: -(order.couponAmount || 0) },
        ];

        charges.forEach(c => {
            const label = c.label.padEnd(20, ' ');
            const value = `Rs. ${c.value}`;
            doc.fontSize(11)
                .text(label, 350, doc.y, { continued: true })
                .text(value, { align: 'right' });
            doc.moveDown(0.3);
        });

        doc.moveDown(0.5);
        doc.fontSize(13).font('Helvetica-Bold')
            .text('Final Total:', 350, doc.y, { continued: true })
            .text(`Rs. ${order.finalTotalPrice}`, { align: 'right' });

        doc.font('Helvetica').moveDown();

        // 📦 Order Footer
        doc.fontSize(11).fillColor('#333');
        doc.text(`Payment Mode: ${order.paymentMode?.toUpperCase()}`, 350);
        doc.text(`Payment Status: ${order.paymentStatus}`, 350);
        doc.text(`Order Status: ${order.orderStatus}`, 350);
        doc.text(`Delivery Date: ${new Date(order.deliveryDate).toLocaleString()}`, 350);


        doc.end();

        stream.on('finish', () => resolve(filePath));
        stream.on('error', reject);
    });
};

module.exports = generateInvoice;



// const generateInvoice = async (order, filePath) => {
//     return new Promise((resolve, reject) => {
//         const dir = path.dirname(filePath);
//         if (!fs.existsSync(dir)) {
//             fs.mkdirSync(dir, { recursive: true });
//         }

//         const doc = new PDFDocument({ margin: 50 });
//         const stream = fs.createWriteStream(filePath);
//         doc.pipe(stream);

//         // ✅ Branding
//         doc.fontSize(22).text('Gorabit', { align: 'center' });
//         doc.moveDown();
//         doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
//         doc.moveDown();

//         // 🧾 Invoice Header
//         doc.fontSize(14).text(`Booking ID: ${order.booking_id}`);
//         doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
//         doc.text(`Customer: ${order.userId?.name} (${order.userId?.email})`);
//         doc.text(`Shop: ${order.shopId?.name}`);
//         doc.moveDown();

//         // 🏠 Address
//         if (order.addressId) {
//             doc.fontSize(12).text('Delivery Address:');
//             doc.text(`${order.addressId.name}, ${order.addressId.address1}`);
//             doc.text(`${order.addressId.address2}`);
//             doc.text(`${order.addressId.city} - ${order.addressId.pincode}, ${order.addressId.state}`);
//             doc.moveDown();
//         }

//         // 📦 Order Items
//         doc.fontSize(16).text('Order Summary', { underline: true });
//         doc.moveDown();

//         order.productData.forEach((item, index) => {
//             const product = item.productId;
//             doc.fontSize(13).text(`${index + 1}. ${product.name}`);
//             doc.fontSize(11)
//                 .text(`- Price: Rs. ${item.price}`)
//                 .text(`- Quantity: ${item.quantity}`);

//             if (item.toppings && item.toppings.length > 0) {
//                 doc.text(`- Toppings:`);
//                 item.toppings.forEach((top) => {
//                     doc.text(`   • ${top.toppingId.name} - Rs. ${top.price}`);
//                 });
//             }

//             doc.text(`- Final Item Total: Rs. ${item.finalPrice}`);
//             doc.moveDown();
//         });

//         // 💰 Charges & Total
//         doc.fontSize(13).text('Charges:', { underline: true });
//         doc.fontSize(11)
//             .text(`Item Total: Rs. ${order.itemTotal}`)
//             .text(`Packing Charge: Rs. ${order.packingCharge}`)
//             .text(`Delivery Charge: Rs. ${order.deliveryCharge}`)
//             .text(`Coupon Discount: Rs. ${order.couponAmount || 0}`)
//             .moveDown()
//             .fontSize(14).text(`Final Total: Rs. ${order.finalTotalPrice}`, { bold: true });

//         doc.moveDown();

//         // 💳 Payment & Delivery
//         doc.fontSize(12).text(`Payment Mode: ${order.paymentMode?.toUpperCase()}`);
//         doc.text(`Payment Status: ${order.paymentStatus}`);
//         doc.text(`Order Status: ${order.orderStatus}`);
//         doc.text(`Delivery Date: ${new Date(order.deliveryDate).toLocaleString()}`);
//         doc.end();

//         stream.on('finish', () => resolve(filePath));
//         stream.on('error', reject);
//     });
// };

// module.exports = generateInvoice;
