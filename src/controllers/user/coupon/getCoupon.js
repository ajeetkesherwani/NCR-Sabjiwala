const Coupon = require("../../../models/coupon");
const catchAsync = require("../../../utils/catchAsync");

exports.getCoupons = catchAsync(async (req, res, next) => {
    const { vendorId } = req.query;

    const today = new Date();

    // Fetch coupons that are either:
    // 1. Admin coupons (vendorId === null)
    // 2. Vendor-specific coupons (vendorId matches)
    const filter = {
        status: 'active',
        startDate: { $lte: today },
        expiryDate: { $gte: today },
        $or: [
            { vendorId: null },
            ...(vendorId ? [{ vendorId }] : [])
        ]
    };

    const coupons = await Coupon.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
        status: true,
        message: "Coupons fetched successfully.",
        data: coupons
    });
});
