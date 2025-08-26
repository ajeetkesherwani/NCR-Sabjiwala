const newOrder = require("../../../models/newOrder");
const Order = require("../../../models/order");
const catchAsync = require("../../../utils/catchAsync");


exports.todayOrder = catchAsync(async (req, res, next) => {
    try {
        const vendorId = req.vendor._id;
        let startOfDay, endOfDay;

        const { range } = req.query;

        if (range === '7days') {
            startOfDay = new Date();
            startOfDay.setDate(startOfDay.getDate() - 7);
            startOfDay.setUTCHours(0, 0, 0, 0);

            endOfDay = new Date();
            endOfDay.setUTCHours(23, 59, 59, 999);
        } else if (range === 'today') {
            startOfDay = new Date();
            startOfDay.setUTCHours(0, 0, 0, 0);

            endOfDay = new Date();
            endOfDay.setUTCHours(23, 59, 59, 999);
        } else {
            startOfDay = null;
            endOfDay = null;
        }

        const query = { vendorId };
        if (startOfDay && endOfDay) {
            query.createdAt = { $gte: startOfDay, $lte: endOfDay };
        }

        const orders = await newOrder.find(query)
            .populate("productData.productId")
            .populate("couponId")
            .populate("addressId")
            .populate("shopId", "name location packingCharge")
            .populate("vendorId", "name email")
            .sort({ createdAt: -1 });

        const transformedOrders = [];

        for (const order of orders) {
            for (const item of order.productData) {
                transformedOrders.push({
                    _id: order._id,
                    order_id: order.booking_id,
                    vendor_id: order.vendorId._id,
                    booking_id: order.booking_id,
                    order_details: {
                        _id: order._id,
                        booking_id: order.booking_id,
                        product_data: [{
                            product_id: item.productId?._id,
                            vendor_id: item.productId?.vendorId,
                            quantity: item.quantity,
                            price: item.price,
                            _id: item._id
                        }],
                        item_total: order.itemTotal,
                        coupon_id: order.couponId ? order.couponId._id : null,
                        coupon_amt: order.couponAmount,
                        coupon_code: order.couponCode,
                        after_coupon_amount: order.afterCouponAmount,
                        user_id: order.userId,
                        address_id: order.addressId?._id,
                        delivery_date: order.deliveryDate,
                        delivery_time: order.deliveryTime,
                        delivery_charge: order.deliveryCharge,
                        order_status: order.orderStatus,
                        payment_mode: order.paymentMode,
                        payment_status: order.paymentStatus,
                        payment_id: order.paymentId,
                        createdAt: order.createdAt
                    },
                    product_id: item.productId?._id,
                    product_details: {
                        _id: item.productId?._id,
                        categoryId: item.productId?.categoryId,
                        subCategoryId: item.productId?.subCategoryId,
                        brandId: item.productId?.brandId,
                        sku: item.productId?.sku,
                        primary_image: item.productId?.primary_image || "",
                        gallery_image: item.productId?.gallery_image || [],
                        name: item.productId?.name,
                        mrp: item.productId?.mrp,
                        sellingPrice: item.productId?.vendorSellingPrice, // updated field
                        discount: item.productId?.discount,
                        unitOfMeasurement: item.productId?.unitOfMeasurement,
                        sellingUnit: item.productId?.sellingUnit,
                        shortDescription: item.productId?.shortDescription,
                        longDescription: item.productId?.longDescription,
                        serviceId: item.productId?.serviceId,
                        vendorId: item.productId?.vendorId,
                        status: item.productId?.status,
                        createdAt: item.productId?.createdAt,
                        __v: item.productId?.__v
                    },
                    quantity: item.quantity,
                    price: item.price,
                    createdAt: order.createdAt
                });
            }
        }

        const response = {
            status: "success",
            results: transformedOrders.length,
            orders: transformedOrders
        };

        return res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching order details:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
});


// exports.todayOrder = catchAsync(async (req, res, next) => {
//     try {
//         const vendorId = req.vendor._id;
//         let startOfDay, endOfDay;

//         // Determine the date range based on the query parameter
//         const { range } = req.query;

//         if (range === '7days') {
//             startOfDay = new Date();
//             startOfDay.setDate(startOfDay.getDate() - 7); // Subtract 7 days
//             startOfDay.setUTCHours(0, 0, 0, 0);

//             endOfDay = new Date();
//             endOfDay.setUTCHours(23, 59, 59, 999);
//         } else if (range === 'today') {
//             startOfDay = new Date();
//             startOfDay.setUTCHours(0, 0, 0, 0);

//             endOfDay = new Date();
//             endOfDay.setUTCHours(23, 59, 59, 999);
//         } else {
//             // For 'all' or any other value, do not apply date filtering
//             startOfDay = null;
//             endOfDay = null;
//         }

//         // Build the query object
//         const query = { vendorId };
//         if (startOfDay && endOfDay) {
//             query.createdAt = { $gte: startOfDay, $lte: endOfDay };
//         }

//         const orders = await newOrder.find(query)
//             .populate("productData.productId")
//             .populate("couponId")
//             .populate("addressId")
//             .populate("shopId", "name location packingCharge")
//             .populate("vendorId", "name email")
//             .sort({ createdAt: -1 });

//         // Transform the orders data to match the Flutter model
//         const transformedOrders = orders.map(order => ({
//             _id: order._id,
//             order_id: order.booking_id,
//             vendor_id: order.vendorId._id,
//             booking_id: order.booking_id,
//             order_details: {
//                 _id: order._id,
//                 booking_id: order.booking_id,
//                 product_data: [{
//                     product_id: order.productData.product_id._id,
//                     vendor_id: order.productData.product_id.vendorId,
//                     quantity: order.productData.quantity,
//                     price: order.productData.price,
//                     _id: order.productData._id
//                 }],
//                 item_total: order.itemTotal,
//                 coupon_id: order.couponId ? order.couponId._id : null,
//                 coupon_amt: order.couponAmount,
//                 coupon_code: order.couponCode,
//                 after_coupon_amount: order.afterCouponAmount,
//                 user_id: order.userId,
//                 address_id: order.addressId._id,
//                 delivery_date: order.deliveryDate,
//                 delivery_time: order.deliveryTime,
//                 delivery_charge: order.deliveryCharge,
//                 order_status: order.orderStatus,
//                 payment_mode: order.paymentMode,
//                 payment_status: order.paymentStatus,
//                 payment_id: order.paymentId,
//                 createdAt: order.createdAt
//             },
//             product_id: order.productData.product_id._id,
//             product_details: {
//                 _id: order.productData.product_id._id,
//                 categoryId: order.productData.product_id.categoryId,
//                 subCategoryId: order.productData.product_id.subCategoryId,
//                 brandId: order.productData.product_id.brandId,
//                 sku: order.productData.product_id.sku,
//                 primary_image: order.productData.product_id.primary_image || "",
//                 gallery_image: order.productData.product_id.gallery_image || [],
//                 name: order.productData.product_id.name,
//                 mrp: order.productData.product_id.mrp,
//                 sellingPrice: order.productData.product_id.sellingPrice,
//                 discount: order.productData.product_id.discount,
//                 unitOfMeasurement: order.productData.product_id.unitOfMeasurement,
//                 sellingUnit: order.productData.product_id.sellingUnit,
//                 shortDescription: order.productData.product_id.shortDescription,
//                 longDescription: order.productData.product_id.longDescription,
//                 serviceId: order.productData.product_id.serviceId,
//                 vendorId: order.productData.product_id.vendorId,
//                 status: order.productData.product_id.status,
//                 createdAt: order.productData.product_id.createdAt,
//                 __v: order.productData.product_id.__v
//             },
//             quantity: order.productData.quantity,
//             price: order.productData.price,
//             createdAt: order.createdAt
//         }));

//         const response = {
//             status: "success",
//             results: transformedOrders.length,
//             orders: transformedOrders
//         };

//         return res.status(200).json(response);
//     } catch (error) {
//         console.error("Error fetching order details:", error);
//         return res.status(500).json({ success: false, message: "Server Error", error: error.message });
//     }
// });

// exports.todayOrder = catchAsync(async (req, res, next) => {
//     try {
//         const vendorId = req.vendor._id;
//         const startOfDay = new Date();
//         startOfDay.setUTCHours(0, 0, 0, 0);

//         const endOfDay = new Date();
//         endOfDay.setUTCHours(23, 59, 59, 999);

//         const orders = await Order.find({ vendorId, createdAt: { $gte: startOfDay, $lte: endOfDay } })
//             .populate("productData.product_id")
//             .populate("couponId")
//             .populate("addressId")
//             .populate("shopId", "name location packingCharge")
//             .populate("vendorId", "name email")
//             .sort({ createdAt: -1 });

//         return res.status(200).json({ success: true, orders });
//     } catch (error) {
//         console.error("Error fetching order details:", error);
//         return res.status(500).json({ success: false, message: "Server Error", error: error.message });
//     }
// });