const Coupon = require("../../../models/coupon");
const newCart = require("../../../models/newCart");
const newOrder = require("../../../models/newOrder");

exports.getAvailableCoupons = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await newCart.findOne({ userId, status: 'active' })
            .populate('shops.shopId', 'name')
            .populate('shops.vendorId', 'name');

        if (!cart || !cart.shops || cart.shops.length === 0) {
            return res.status(200).json({ success: true, message: "Your cart is empty." });
        }

        let cartGrandTotal = 0;
        const shopSubtotalsMap = new Map();
        const shopIds = cart.shops.map(shopItem => {
            const shopTotal = shopItem.items.reduce((sum, item) => sum + item.finalPrice, 0);
            shopSubtotalsMap.set(shopItem.shopId._id.toString(), shopTotal);
            cartGrandTotal += shopTotal;
            return shopItem.shopId._id;
        });

        const today = new Date();
        const potentialCoupons = await Coupon.find({
            status: 'active',
            startDate: { $lte: today },
            expiryDate: { $gte: today },
            $or: [
                { shopId: null }, // Global Admin coupons
                { shopId: { $in: shopIds } } // Coupons for the specific shops in the cart
            ]
        });

        let usageMap = new Map();
        if (potentialCoupons.length > 0) {
            const userCouponUsage = await newOrder.aggregate([
                { $match: { userId, 'appliedCoupons.couponId': { $in: potentialCoupons.map(c => c._id) } } },
                { $unwind: '$appliedCoupons' },
                { $group: { _id: '$appliedCoupons.couponId', count: { $sum: 1 } } }
            ]);
            usageMap = new Map(userCouponUsage.map(item => [item._id.toString(), item.count]));
        }

        const adminCoupons = [];
        const shopCouponsMap = new Map();

        for (const coupon of potentialCoupons) {
            const userUses = usageMap.get(coupon._id.toString()) || 0;
            if (coupon.singlePersonUsageLimit > 0 && userUses >= coupon.singlePersonUsageLimit) {
                // Skip coupons the user has already used up their limit for.
                continue;
            }

            // ✅ MODIFIED LOGIC STARTS HERE
            if (coupon.shopId === null) { // Admin coupon
                const isApplicable = cartGrandTotal >= coupon.minOrderAmount;
                const remainingAmount = Math.max(0, coupon.minOrderAmount - cartGrandTotal);
                const message = isApplicable
                    ? "Coupon is applicable on your total cart value."
                    : `Add ₹${remainingAmount.toFixed(2)} more to your cart to use this coupon.`;

                adminCoupons.push({
                    ...coupon.toObject(), // Convert mongoose doc to plain object to add properties
                    isApplicable,
                    message
                });

            } else { // Shop-specific coupon
                const shopIdStr = coupon.shopId.toString();
                const shopSubtotal = shopSubtotalsMap.get(shopIdStr);

                if (shopSubtotal !== undefined) {
                    const isApplicable = shopSubtotal >= coupon.minOrderAmount;
                    const remainingAmount = Math.max(0, coupon.minOrderAmount - shopSubtotal);
                    const message = isApplicable
                        ? "Coupon is applicable for this shop."
                        : `Add ₹${remainingAmount.toFixed(2)} more from this shop to use this coupon.`;

                    const couponWithStatus = {
                        ...coupon.toObject(),
                        isApplicable,
                        message
                    };

                    if (!shopCouponsMap.has(shopIdStr)) {
                        shopCouponsMap.set(shopIdStr, []);
                    }
                    shopCouponsMap.get(shopIdStr).push(couponWithStatus);
                }
            }
        }

        const shopsWithCoupons = cart.shops.map(shopItem => ({
            shopId: shopItem.shopId._id,
            shopName: shopItem.shopId.name,
            vendorId: shopItem.vendorId._id,
            vendorName: shopItem.vendorId.name,
            itemTotal: shopSubtotalsMap.get(shopItem.shopId._id.toString()),
            availableCoupons: shopCouponsMap.get(shopItem.shopId._id.toString()) || []
        }));

        res.status(200).json({
            success: true,
            cartTotal: cartGrandTotal,
            adminCoupons: adminCoupons,
            shops: shopsWithCoupons
        });

    } catch (error) {
        console.error("Error fetching available coupons:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};