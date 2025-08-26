const newOrder = require("../../../models/newOrder");
const catchAsync = require("../../../utils/catchAsync");

/**
 * Normalize incoming status to what's stored in DB
 */
const normalizeStatus = (status) => {
    if (!status) return status;
    const s = status.toLowerCase();

    if (s === "pickedup") return "picked up";
    if (s === "cancelled") return "cancelledByVendor"; // vendor-triggered cancel
    return s;
};

/**
 * Fields that should get a timestamp when we move into that status
 */
const STATUS_TIMESTAMP_FIELD = {
    accepted: "acceptedAt",
    preparing: "preparationStartedAt",
    delay: "dealyAt",
    ready: "readyAt",
    shipped: "shippedAt",
    "picked up": "pickedupAt",
    running: "runningAt",
    delivered: "deliveredAt",
    cancelledByVendor: "cancelledAt",
    cancelledByUser: "cancelledAt",
    cancelledByDriver: "cancelledAt",
    cancelledByAdmin: "cancelledAt",
    cancelled: "cancelledAt",
};

/**
 * After these statuses, vendor should NOT be able to change anything
 * (driver / system handles them)
 */
const LOCKED_STATUSES = new Set([
    "ready",
    "shipped",
    "picked up",
    "running",
    "out of delivery",
    "delivered",
    "cancelledByUser",
    "cancelledByVendor",
    "cancelledByDriver",
    "cancelledByAdmin",
    "cancelled",
]);

/**
 * Allowed transitions (from -> to) for vendor
 * (Adjust as per your business rules)
 */
const ALLOWED_TRANSITIONS = {
    pending: ["accepted", "cancelledByVendor"],
    accepted: ["preparing", "cancelledByVendor"],
    preparing: ["delay", "ready", "cancelledByVendor"],
    // once ready, vendor can't change anything (driver takes over)
};

exports.changeOrderStatus = catchAsync(async (req, res) => {
    const { orderId } = req.params;
    let { status, preparationTime } = req.body;

    status = normalizeStatus(status);

    const VENDOR_ALLOWED = new Set([
        "accepted",
        "preparing",
        "delay",
        "ready",
        "cancelledByVendor",
    ]);

    if (!VENDOR_ALLOWED.has(status)) {
        return res
            .status(400)
            .json({ success: false, message: "Invalid order status" });
    }

    // For preparing / delay we require a positive preparationTime
    const needsTime = status === "preparing" || status === "delay";
    if (needsTime && (!preparationTime || Number(preparationTime) <= 0)) {
        return res
            .status(400)
            .json({ success: false, message: "Enter a valid preparation time" });
    }

    const order = await newOrder.findById(orderId);
    if (!order) {
        return res
            .status(404)
            .json({ success: false, message: "Order not found" });
    }

    const current = order.orderStatus;

    // Block updates after locked states
    if (LOCKED_STATUSES.has(current)) {
        return res.status(400).json({
            success: false,
            message: "You cannot update the status for this order anymore.",
        });
    }

    // Handle delay separately
    if (status === "delay") {
        if (current !== "preparing") {
            return res.status(400).json({
                success: false,
                message: "You can only delay an order that is currently preparing.",
            });
        }

        order.preparationTime =
            (order.preparationTime || 0) + Number(preparationTime);
        order.dealyAt = new Date(); // field name in schema is `dealyAt`
        await order.save();

        return res.status(200).json({
            success: true,
            message: "Preparation time extended",
            order,
        });
    }

    // Check transition validity
    const next = status;
    const allowedNext = ALLOWED_TRANSITIONS[current] || [];
    if (!allowedNext.includes(next)) {
        return res.status(400).json({
            success: false,
            message: `Invalid transition: cannot change status from "${current}" to "${next}".`,
        });
    }

    // Business rule: vendor can only cancel pending/accepted/preparing
    if (
        next === "cancelledByVendor" &&
        !["pending", "accepted", "preparing"].includes(current)
    ) {
        return res.status(400).json({
            success: false,
            message: "You can't cancel this order at its current stage.",
        });
    }

    // Apply transition-specific changes
    switch (next) {
        case "accepted":
            order.orderStatus = "accepted";
            io.to("admin").emit("new-order", {
                fromUser: "user.name",
                orderCount: "orders.length",
                time: new Date().toISOString()
            });
            break;

        case "preparing":
            order.orderStatus = "preparing";
            order.preparationStartedAt = new Date();
            order.preparationTime = Number(preparationTime);
            break;

        case "ready":
            if (current !== "preparing") {
                return res.status(400).json({
                    success: false,
                    message: "Order must be in preparing before it can be marked ready.",
                });
            }
            order.orderStatus = "ready";
            break;

        case "cancelledByVendor":
            order.orderStatus = "cancelledByVendor";
            break;

        default:
            return res
                .status(400)
                .json({ success: false, message: "Invalid status update request." });
    }

    // Stamp timestamp if we have a mapping
    const tsField = STATUS_TIMESTAMP_FIELD[next];
    if (tsField) order[tsField] = new Date();

    await order.save();

    return res.status(200).json({
        success: true,
        message: "Order status updated",
        order,
    });
});














// const newOrder = require("../../../models/newOrder");
// const catchAsync = require("../../../utils/catchAsync");

// exports.changeOrderStatus = catchAsync(async (req, res, next) => {
//     try {
//         const { orderId } = req.params;
//         const { status, preparationTime } = req.body;

//         const allowedStatuses = ["accepted", "preparing", "delay", "ready", "cancelled", "cancelledByVendor"];
//         if (!allowedStatuses.includes(status)) {
//             return res.status(400).json({ success: false, message: "Invalid order status" });
//         }

//         if (status == "preparing" && (!preparationTime || preparationTime <= 0)) {
//             return res.status(400).json({ success: false, message: "Enter correct time" });
//         }

//         const order = await newOrder.findById(orderId);
//         if (!order) {
//             return res.status(404).json({ success: false, message: "Order not found" });
//         }

//         if (status == "delay") {
//             order.preparationTime += preparationTime;
//             await order.save();
//             return res.status(200).json({ success: true, message: "Preparation time extended", order });
//         }

//         if (status == "cancelled" && order.orderStatus !== "pending") {
//             return res.status(404).json({ success: false, message: "You can't cancle this order" });
//         }

//         if (status == "cancelled" && order.orderStatus == "pending") {
//             order.orderStatus = "cancelledByVendor";
//             order.cancelledAt = new Date();
//             await order.save()
//             return res.status(200).json({ success: true, message: "Order cancelled" });
//         }

//         // Guard: If already marked ready, do not allow further changes
//         if (order.orderStatus == "ready" ||
//             order.orderStatus == "shipped" ||
//             order.orderStatus == "running" ||
//             order.orderStatus == "out of delivery" ||
//             order.orderStatus == "delivered" ||
//             order.orderStatus == "cancelled"
//         ) {
//             return res.status(400).json({ success: false, message: "You cannot be update status." });
//         }

//         // Handle logic based on status
//         switch (status) {
//             case "accepted":
//                 order.orderStatus = "accepted";
//                 // if (preparationTime) {
//                 //     order.preparationTime = preparationTime;
//                 //     order.preparationStartedAt = new Date();
//                 // }
//                 break;

//             case "preparing":
//                 order.preparationStartedAt = new Date();
//                 order.preparationTime = preparationTime;
//                 order.orderStatus = "preparing";
//                 break;

//             case "ready":
//                 if (order.orderStatus !== "preparing") {
//                     return res.status(400).json({
//                         success: false,
//                         message: "Order must be in accepted."
//                     });
//                 }
//                 order.orderStatus = "ready";
//                 order.readyAt = new Date();
//                 break;

//             case "cancelled":
//                 order.orderStatus = "cancelledByVendor";
//                 order.cancelledAt = new Date();
//                 break;
//             case "shipped":
//             case "out of delivery":
//             case "delivered":
//                 order.orderStatus = status;
//                 break;

//             default:
//                 return res.status(400).json({ success: false, message: "Invalid status update request." });
//         }

//         await order.save();
//         return res.status(200).json({ success: true, message: "Order status updated", order });
//     } catch (error) {
//         console.error("Error updating order status:", error);
//         return res.status(500).json({ success: false, message: "Server Error", error: error.message });
//     }
// });
