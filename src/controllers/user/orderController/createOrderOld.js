const Order = require("../../../models/order");
const OrderDetails = require("../../../models/orderDetails");
const VendorOrderHistory = require("../../../models/vendorOrderHistory");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.createOrder = catchAsync(async (req, res, next) => {
    let { product_data, item_total, coupon_id, coupon_amt, coupon_code, after_coupon_amount, address_id, delivery_date, delivery_time, delivery_charge, payment_mode } = req.body;

    if (!product_data || !Array.isArray(product_data) || product_data.length === 0) {
        return next(new AppError("Product data is required and must be an array.", 400));
    }
    if (!item_total) return next(new AppError("Total Items Price is required.", 400));
    if (!address_id) return next(new AppError("Address ID is required.", 400));
    if (!delivery_date) return next(new AppError("Delivery date is required.", 400));
    if (!delivery_time) return next(new AppError("Delivery time is required.", 400));
    if (!payment_mode) return next(new AppError("Payment mode is required.", 400));

    // const user_id = req.user._id
    let user_id = "661234abcd5678ef90123456";

    // Generate a unique order ID
    const booking_id = `ORD-${Date.now()}`;

    // Create new order
    const order = new Order({
        booking_id,
        product_data,
        item_total,
        coupon_id: coupon_id || null,
        coupon_amt: coupon_amt || 0,
        coupon_code: coupon_code || null,
        after_coupon_amount,
        user_id,
        address_id,
        delivery_date,
        delivery_time,
        delivery_charge: delivery_charge || 0,
        order_status: "pending",
        payment_mode,
        payment_status: "pending",
        payment_id: null
    });

    await order.save();

    // filter order based on vendor and save theme in vendorOrder table
    let vendorOrders = {};
    product_data.forEach((product) => {
        let vendor_id = product.vendor_id;
        if (!vendorOrders[vendor_id]) {
            vendorOrders[vendor_id] = [];
        }

        vendorOrders[vendor_id].push({
            product_id: product.product_id,
            name: product.name,
            quantity: product.quantity,
            price: product.price,
        });
    })

    for (let vendor_id in vendorOrders) {
        const vendorOrder = new VendorOrderHistory({
            order_id: order._id,
            booking_id,
            vendor_id,
            products: vendorOrders[vendor_id],
            order_status: "pending"
        });
        await vendorOrder.save();
    }

    // store single single order in order details schema
    for (let product of product_data) {
        const orderDetail = new OrderDetails({
            order_id: order._id,
            vendor_id: product.vendor_id,
            booking_id,
            product_id: product.product_id,
            quantity: product.quantity,
            price: product.price,
            status: "pending"
        });
        await orderDetail.save();
    }


    return res.status(201).json({
        status: true,
        message: "Order created successfully",
        data: { order },
    });
});
