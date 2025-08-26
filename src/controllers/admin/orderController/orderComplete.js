const Order = require("../../../models/order");
const Setting = require("../../../models/settings");
const Shop = require("../../../models/shop");
const Vendor = require("../../../models/vendor");
const WalletHistory = require("../../../models/walletHistory");
const WalletTransaction = require("../../../models/walletTransaction");
const catchAsync = require("../../../utils/catchAsync");

exports.orderComplete = catchAsync(async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ status: false, message: "Order not found" });

        const { itemTotal, couponAmount, afterCouponAmount, packingCharge, deliveryCharge, shopId, vendorId } = order;
        const { commission: commissionRate, gst: gstRate } = await Setting.findById("680f1081aeb857eee4d456ab");

        // Calculate amounts
        const commissionAmount = Math.ceil(itemTotal * commissionRate / 100);
        const gstAmount = Math.ceil(commissionAmount * gstRate / 100);
        const vendorAmount = Math.ceil(itemTotal - commissionAmount - gstAmount + packingCharge);
        const deliveryBoyAmount = Math.ceil(deliveryCharge);



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
        shop.wallet_balance += Math.ceil(vendorAmount);
        await shop.save()

        // Record wallet history
        await WalletHistory.create({
            shopId,
            vendorId,
            action: "credit",
            amount: vendorAmount,
            balance_after_action: vendor.wallet_balance,
            description: "Order payout"
        });

        order.orderStatus = "delivered";
        await order.save();

        res.status(200).json({
            status: true,
            message: "Order completed successfully",
            data: { itemTotal, couponAmount, afterCouponAmount, packingCharge, deliveryCharge, vendorAmount, deliveryBoyAmount },
            walletTransaction: walletTx,
            newWalletBalance: vendor.wallet_balance
        });
    } catch (error) {
        console.error("Order Complete Error:", error);
        return res.status(500).json({ success: false, message: "Server error while order complete.", error: error.message });
    }
});
