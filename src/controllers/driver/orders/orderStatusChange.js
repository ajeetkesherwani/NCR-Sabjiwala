const Driver = require("../../../models/driver");
const newOrder = require("../../../models/newOrder");
const Order = require("../../../models/order");
const Setting = require("../../../models/settings");
const WalletHistory = require("../../../models/walletHistory");
const WalletTransaction = require("../../../models/walletTransaction");
const catchAsync = require("../../../utils/catchAsync");

exports.orderStatusChange = catchAsync(async (req, res) => {
    try {

        const driverId = req.driver._id;
        const { orderId } = req.params;
        const status = req.body.status;

        const order = await newOrder.findById(orderId);
        const driver = await Driver.findById(driverId);
        if (!order) return res.status(404).json({ status: false, message: "Order not found" });

        if (status == "cancelled") {
            order.orderStatus = "cancelled";
            order.assignedDriver = null; // Clear assigned driver
            driver.currentOrderId = null; // Clear current order for driver
            await driver.save();
            await order.save();
            return res.status(200).json({ status: true, message: "Order cancelled successfully" });
        }

        if (status == "accepted") {
            order.orderStatus = "running";
            driver.currentOrderId = order._id; // Set current order for driver
            await driver.save();
            await order.save();
            return res.status(200).json({ status: true, message: "Order accepted successfully" });
        }

        const { itemTotal, couponAmount, afterCouponAmount, packingCharge, deliveryCharge, shopId, vendorId } = order;
        const { commission: commissionRate, gst: gstRate, finialPlateformFee: plateformFee } = await Setting.findById("680f1081aeb857eee4d456ab");

        // return res.status(200).json({ commissionRate, gstRate, plateformFee, driver });

        // Calculate amounts
        const commissionAmount = Math.ceil(itemTotal * commissionRate / 100);
        const gstAmount = Math.ceil(commissionAmount * gstRate / 100);
        const vendorAmount = Math.ceil(itemTotal - commissionAmount - gstAmount + packingCharge);
        const deliveryBoyAmount = Math.ceil(deliveryCharge);

        if (order.paymentMode === "cod") {
            driver.cashCollection += order.finalTotalPrice;
        }

        // Update wallet transaction
        const walletTx = await WalletTransaction.create({
            shopId,
            orderId: order._id,
            amount: itemTotal,
            commission: commissionRate,
            commission_amount: commissionAmount,
            gst: gstRate,
            gst_amount: gstAmount,
            type: "Order Payment",
            is_bonus: false,
            final_amount: vendorAmount
        });

        // Update vendor wallet
        const vendor = await Vendor.findById(vendorId);
        vendor.wallet_balance += Math.ceil(vendorAmount);
        await vendor.save();

        const shop = await Shop.findById(shopId);
        shop.wallet_balance += Math.ceil(vendorAmount)
        await shop.save()

        // const driver = await Driver.findById(driverId);
        driver.wallet_balance += Math.ceil(deliveryBoyAmount)
        driver.currentOrderId = null;
        await driver.save()

        // Record wallet history for vendor
        await WalletHistory.create({
            shopId,
            vendorId,
            action: "credit",
            amount: vendorAmount,
            balance_after_action: vendor.wallet_balance,
            description: "Order payout"
        });

        // Record wallet history for driver
        await WalletHistory.create({
            driverId,
            action: "credit",
            amount: deliveryBoyAmount,
            balance_after_action: driver.wallet_balance,
            description: "Order payout"
        });

        order.orderStatus = "delivered";
        await order.save();

        res.status(200).json({
            status: true,
            message: "Order completed successfully",
            data: { itemTotal, couponAmount, afterCouponAmount, packingCharge, deliveryCharge, vendorAmount },
            walletTransaction: walletTx,
            newWalletBalance: vendor.wallet_balance,
            driverWalletBalance: driver.wallet_balance
        });
    } catch (error) {
        console.error("Order Complete Error:", error);
        return res.status(500).json({ success: false, message: "Server error while order complete.", error: error.message });
    }
});
