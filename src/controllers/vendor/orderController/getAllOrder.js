// const Order = require("../../../models/order");
const newOrder = require("../../../models/newOrder");
const catchAsync = require("../../../utils/catchAsync");


exports.getAllOrder = catchAsync(async (req, res, next) => {
    try {
        const vendorId = req.vendor._id;
        const { type } = req.query;

        let filter = { vendorId };

        // Filter for orders based on type
        if (type === "new") {
            filter.orderStatus = "pending"
        } else if (type === "accepted") {
            filter.orderStatus = "accepted";
        } else if (type === "preparing") {
            filter.orderStatus = { $in: ["preparing", "dealy"] };
        } else if (type === "ready") {
            filter.orderStatus = "ready";
        } else if (type === "pickedup") {
            filter.orderStatus = "picked up";
        } else if (type === "running") {
            filter.orderStatus = "running";
        } else if (type === "delivered") {
            filter.orderStatus = "delivered";
        } else if (type === "cancelled") {
            filter.orderStatus = {
                $in: ["cancelledByUser", "cancelledByVendor", "cancelledByDriver", "cancelledByAdmin", "cancelled"]
            };
        }

        // Main order data
        const orders = await newOrder.find(filter)
            .populate("productData.productId", "name primary_image")
            .populate("couponId")
            .populate("addressId")
            .populate("shopId", "name location packingCharge")
            .populate("vendorId", "name email")
            .sort({ createdAt: -1 });

        // Fetch counts for all statuses
        const allCounts = await newOrder.aggregate([
            { $match: { vendorId } },
            {
                $group: {
                    _id: "$orderStatus",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Map to a dictionary
        const statusCountMap = allCounts.reduce((acc, cur) => {
            acc[cur._id] = cur.count;
            return acc;
        }, {});

        // Group similar statuses
        const totalCancelled = (statusCountMap.cancelledByUser || 0) +
            (statusCountMap.cancelledByVendor || 0) +
            (statusCountMap.cancelledByDriver || 0) +
            (statusCountMap.cancelledByAdmin || 0) +
            (statusCountMap.cancelled || 0);

        const counts = {
            new: statusCountMap.pending || 0,
            accepted: statusCountMap.accepted || 0,
            preparing: (statusCountMap.preparing || 0) + (statusCountMap.dealy || 0),
            ready: statusCountMap.ready || 0,
            pickedup: statusCountMap["picked up"] || 0,
            running: statusCountMap.running || 0,
            delivered: statusCountMap.delivered || 0,
            cancelled: totalCancelled,
            all: allCounts.reduce((acc, cur) => acc + cur.count, 0)
        };

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders,
            counts
        });

    } catch (error) {
        console.error("Error fetching order details:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
});





// exports.getAllOrder = catchAsync(async (req, res, next) => {
//     try {
//         const vendorId = req.vendor._id;
//         const { type } = req.query

//         let filter = { vendorId };
//         // if (type === "new") {
//         //     filter.orderStatus = { $in: ["pending", "accepted", "preparing"] };
//         // } else if (type === "ready") {
//         //     filter.orderStatus = "ready";
//         // }

//         if (type === "new") {
//             filter.orderStatus = "pending"
//         } else if (type === "accepted") {
//             filter.orderStatus = "accepted";
//         }else if (type === "preparing") {
//             filter.orderStatus = { $in: ["preparing", "dealy"] };
//         }else if (type === "ready") {
//             filter.orderStatus = "ready";
//         }else if (type === "pickedup") {
//             filter.orderStatus = "picked up";
//         }else if (type === "running") {
//             filter.orderStatus = "running";
//         }else if (type === "delivered") {
//             filter.orderStatus = "delivered";
//         }else if (type === "cancelled") {
//             filter.orderStatus = { $in: ["cancelledByUser", "cancelledByVendor", "cancelledByDriver", "cancelledByAdmin", "cancelled"] };
//         }


//         const orders = await newOrder.find(filter)
//             .populate("productData.productId", "name primary_image")
//             .populate("couponId") // If a coupon was applied
//             .populate("addressId") // Full address
//             .populate("shopId", "name location packingCharge") // Shop info
//             .populate("vendorId", "name email") // Vendor info
//             .sort({ createdAt: -1 }); // Newest first

//         return res.status(200).json({ success: true, count: orders.length, orders });
//     } catch (error) {
//         console.error("Error fetching order details:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Server Error",
//             error: error.message,
//         });
//     }
// });



// exports.getAllOrder = catchAsync(async (req, res, next) => {
//     try {
//         const vendorId = req.vendor._id;

//         const orders = await Order.find({ vendorId })
//             .populate("productData.product_id") // Get product info
//             .populate("couponId") // If a coupon was applied
//             .populate("addressId") // Full address
//             .populate("shopId", "name location packingCharge") // Shop info
//             .populate("vendorId", "name email") // Vendor info
//             .sort({ createdAt: -1 }); // Newest first

//         return res.status(200).json({ success: true, orders });
//     } catch (error) {
//         console.error("Error fetching order details:", error);
//         return res.status(500).json({ success: false, message: "Server Error", error: error.message });
//     }
// });
