
const { v4: uuidv4 } = require('uuid');
const newCart = require('../../../models/newCart');
const newOrder = require('../../../models/newOrder');
const User = require('../../../models/user');
const Address = require('../../../models/address');

exports.createNewOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { deliveryDate, deliveryTime, paymentMode, deliveryCharges = [], coupon = {}, paymentId, paymentStatus } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const addressId = await Address.findOne({ userId, isDefault: true });
        if (!addressId) {
            return res.status(400).json({ message: 'Default address not found.' });
        }

        const cart = await newCart.findOne({ userId, status: 'active', serviceType: user.serviceType });
        if (!cart || !cart.shops.length) {
            return res.status(400).json({ message: 'Cart is empty or not found.' });
        }

        const orders = [];

        for (const shopData of cart.shops) {
            const { shopId, vendorId, items } = shopData;

            const shop = await Shop.findById(shopId);
            if (!shop) continue;

            const orderCount = await newOrder.countDocuments();

            // Get shop short code or use _id
            // const shopCode = `ORD${String(shopId).slice(-3).toUpperCase()}`; // Example: SHOP1A2
            const orderNumber = (orderCount + 1).toString().padStart(4, '0'); // e.g., 0001

            const booking_id = `ORD${orderNumber}`;

            const deliveryChargeObj = deliveryCharges.find(d => d.shopId === shopId.toString());
            const deliveryCharge = deliveryChargeObj ? deliveryChargeObj.charge : 0;

            const packingCharge = shop.packingCharge || 0;

            const productData = items.map(item => ({
                productId: item.productId,
                price: item.price,
                quantity: item.quantity,
                toppings: item.toppings,
                finalPrice: item.finalPrice
            }));

            const itemTotal = productData.reduce((sum, p) => sum + (p.finalPrice * p.quantity), 0);

            const couponAmount = coupon?.amount || 0;
            const afterCouponAmount = Math.max(0, itemTotal - couponAmount);
            const finalTotalPrice = afterCouponAmount + deliveryCharge + packingCharge;

            const order = new newOrder({
                booking_id,
                shopId,
                vendorId,
                userId,
                addressId,
                deliveryDate,
                deliveryTime,
                paymentMode,
                productData,
                itemTotal,
                couponId: coupon?.id || null,
                couponCode: coupon?.code || '',
                couponAmount,
                afterCouponAmount,
                deliveryCharge,
                packingCharge,
                finalTotalPrice,
                serviceType: cart.serviceType,
                paymentId,
                paymentStatus,
            });

            await order.save();
            orders.push(order);
        }

        cart.status = 'ordered';
        await cart.save();

        res.status(201).json({
            success: true,
            message: 'Orders created successfully',
            orders
        });

    } catch (error) {
        console.error('CreateOrder Error:', error);
        res.status(500).json({ message: 'Something went wrong while creating orders', error: error.message });
    }
};
