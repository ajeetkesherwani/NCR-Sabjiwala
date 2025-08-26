const newOrder = require("../../../models/newOrder");
const Order = require("../../../models/order");
const catchAsync = require("../../../utils/catchAsync");

exports.getOrder = catchAsync(async (req, res, next) => {
    try {
        const { orderId } = req.params;

        const order = await newOrder.findById(orderId)
            .populate("productData.productId")
            .populate("userId", "name email")
            .populate("addressId")
            .populate("couponId")
            .populate("shopId", "name location packingCharge")
            .populate("vendorId", "name email");

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Transform the order data to match the Flutter model
        const responseData = {
            images: order.productData.productId.primary_image || "",
            name: order.productData.productId.name,
            customer_name: order.userId.name,
            quantity: order.productData.quantity,
            booking_id: order.booking_id,
            delivery_date: order.deliveryDate.toISOString().split('T')[0],
            delivery_time: order.deliveryTime,
            payment_mode: order.paymentMode,
            payment_status: order.paymentStatus,
            address: {
                _id: order.addressId._id,
                address1: order.addressId.address1,
                city: order.addressId.city,
                pincode: order.addressId.pincode,
                state: order.addressId.state,
                isDefault: order.addressId.isDefault,
                status: order.addressId.status,
                createdAt: order.addressId.createdAt,
                __v: order.addressId.__v
            }
        };

        const response = {
            status: "success",
            data: {
                responseData: responseData
            }
        };

        return res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching order details:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
});


// exports.getOrder = catchAsync(async (req, res, next) => {

//     try {
//         const { orderId } = req.params;

//         const order = await Order.findById(orderId)
//             .populate("productData.product_id") // Populate product info
//             .populate("userId", "name email") // Populate user info (select fields)
//             .populate("addressId") // Full address
//             .populate("couponId") // If applied
//             .populate("shopId", "name location packingCharge") // Shop details
//             .populate("vendorId", "name email"); // Vendor info

//         if (!order) {
//             return res.status(404).json({ success: false, message: "Order not found" });
//         }

//         return res.status(200).json({ success: true, order });
//     } catch (error) {
//         console.error("Error fetching order details:", error);
//         return res.status(500).json({ success: false, message: "Server Error", error: error.message });
//     }
// })