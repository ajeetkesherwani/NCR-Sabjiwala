const newOrder = require("../../../models/newOrder");
const Shop = require("../../../models/shop");
const shopRating = require("../../../models/shopRating");


// POST /api/shop-ratings
exports.shopRatingCreate = async (req, res) => {
    try {
        const { shopId, orderId, rating, review } = req.body;
        const userId = req.user._id;

        // Prevent duplicate rating for the same shop and order
        const existing = await shopRating.findOne({ userId, shopId, orderId });
        if (existing) {
            return res.status(400).json({ success: false, message: "You already reviewed this order." });
        }

        // Create new rating
        const newRating = await shopRating.create({ userId, shopId, orderId, rating, review, });

        const newOrderUpdate = await newOrder.findByIdAndUpdate(orderId, { isRated: true });
        if (!newOrderUpdate) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }


        // Recalculate shop average rating
        const agg = await shopRating.aggregate([
            { $match: { shopId: newRating.shopId } },
            {
                $group: {
                    _id: '$shopId',
                    avgRating: { $avg: '$rating' }
                }
            }
        ]);

        const { avgRating } = agg[0] || {};
        await Shop.findByIdAndUpdate(shopId, {
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
