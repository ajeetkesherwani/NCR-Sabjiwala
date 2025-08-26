const newOrder = require("../../../models/newOrder");
const catchAsync = require("../../../utils/catchAsync");


exports.orderDetails = catchAsync(async (req, res, next) => {
    try {
        const { orderId } = req.params;

        const order = await newOrder.findById(orderId)
            .populate("productData.productId", "name primary_image")
            .populate("productData.toppings.toppingId", "name")
            .populate("userId", "name email mobileNo profileImage")
            .populate("addressId", "personName personMob address1 city state pincode")
            .populate("couponId", "code amount") // optional, even if unused
            .populate("shopId", "name location packingCharge address")
            .populate("vendorId", "name email");

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Construct only necessary fields
        const filteredOrder = {
            _id: order._id,
            booking_id: order.booking_id,
            deliveryDate: order.deliveryDate,
            deliveryTime: order.deliveryTime,
            orderStatus: order.orderStatus,
            paymentStatus: order.paymentStatus,
            paymentMode: order.paymentMode,
            couponAmount: order.couponAmount,
            couponCode: order.couponCode,
            afterCouponAmount: order.afterCouponAmount,
            itemTotal: order.itemTotal,
            packingCharge: order.packingCharge,
            deliveryCharge: order.deliveryCharge,
            finalTotalPrice: order.finalTotalPrice,

            productData: order.productData.map((item) => ({
                quantity: item.quantity,
                price: item.price,
                finalPrice: item.finalPrice,
                toppings: item.toppings.map(t => ({
                    name: t.toppingId?.name,
                    price: t.price
                })),
                productId: {
                    _id: item.productId?._id,
                    name: item.productId?.name,
                    primary_image: item.productId?.primary_image
                }
            })),

            userId: {
                name: order.userId?.name,
                email: order.userId?.email,
                mobileNo: order.userId?.mobileNo,
                profileImage: order.userId?.profileImage
            },

            addressId: {
                personName: order.addressId?.personName,
                personMob: order.addressId?.personMob,
                address1: order.addressId?.address1,
                city: order.addressId?.city,
                state: order.addressId?.state,
                pincode: order.addressId?.pincode
            },

            shopId: {
                name: order.shopId?.name,
                packingCharge: order.shopId?.packingCharge,
                address: order.shopId?.address
            },

            vendorId: {
                name: order.vendorId?.name,
                email: order.vendorId?.email
            }
        };

        return res.status(200).json({
            status: "success",
            order: filteredOrder
        });
    } catch (error) {
        console.error("Error fetching order details:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
});


// exports.orderDetails = catchAsync(async (req, res, next) => {
//     try {
//         const { orderId } = req.params;

//         const order = await newOrder.findById(orderId)
//             .populate("productData.productId")
//             .populate("productData.toppings.toppingId", "name")
//             .populate("userId")
//             .populate("addressId")
//             .populate("couponId")
//             .populate("shopId", "name location packingCharge address")
//             .populate("vendorId", "name email");

//         if (!order) {
//             return res.status(404).json({ success: false, message: "Order not found" });
//         }


//         const response = {
//             status: "success",
//             order
//         };

//         return res.status(200).json(response);
//     } catch (error) {
//         console.error("Error fetching order details:", error);
//         return res.status(500).json({ success: false, message: "Server Error", error: error.message });
//     }
// });


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