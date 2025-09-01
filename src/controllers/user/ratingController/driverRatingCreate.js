const Driver = require("../../../models/driver");
const driverRating = require("../../../models/driverRating");


// POST /api/driver-ratings
exports.driverRatingCreate = async (req, res) => {
    try {
        const { driverId, orderId, rating, review } = req.body;
        const userId = req.user._id;

        // Prevent duplicate rating for the same driver and order
        const existing = await driverRating.findOne({ userId, driverId, orderId });
        if (existing) {
            return res.status(400).json({ success: false, message: "You already reviewed this order." });
        }

        // Create new rating
        const newRating = await driverRating.create({ userId, driverId, orderId, rating, review, });

        // Recalculate driver average rating
        const agg = await driverRating.aggregate([
            { $match: { driverId: newRating.driverId } },
            {
                $group: {
                    _id: '$driverId',
                    avgRating: { $avg: '$rating' }
                }
            }
        ]);

        const { avgRating } = agg[0] || {};
        await Driver.findByIdAndUpdate(driverId, {
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
