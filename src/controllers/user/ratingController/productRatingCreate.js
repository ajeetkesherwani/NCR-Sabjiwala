const Driver = require("../../../models/driver");
const newOrder = require("../../../models/newOrder");
const productRating = require("../../../models/productRating");
const VendorProduct = require("../../../models/vendorProduct");


// POST /api/driver-ratings
exports.productRatingCreate = async (req, res) => {
    try {
        const { productId, orderId, rating, review } = req.body;
        const userId = req.user._id;

        // Prevent duplicate rating for the same driver and order
        const existing = await productRating.findOne({ userId, productId, orderId });
        if (existing) {
            return res.status(400).json({ success: false, message: "You already reviewed this order." });
        }

        // Create new rating
        const newRating = await productRating.create({ userId, productId, orderId, rating, review });

        const newOrderUpdate = await newOrder.findByIdAndUpdate(orderId, { isRated: true });
        if (!newOrderUpdate) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }

        // Recalculate driver average rating
        const agg = await productRating.aggregate([
            { $match: { productId: newRating.productId } },
            {
                $group: {
                    _id: '$productId',
                    avgRating: { $avg: '$rating' }
                }
            }
        ]);

        const { avgRating } = agg[0] || {};
        await VendorProduct.findByIdAndUpdate(productId, {
            rating: avgRating.toString() || "0"
        });

        res.status(201).json({
            success: true,
            message: "Rating submitted successfully",
            data: newRating
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};
