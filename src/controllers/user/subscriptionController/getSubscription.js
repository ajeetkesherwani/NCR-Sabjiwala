const Subscription = require("../../../models/subscription");

exports.getUserSubscriptions = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find subscriptions that are not cancelled
        const subscriptions = await Subscription.find({ userId, status: { $ne: 'inactive' } }).populate('productId', 'name vendorSellingPrice sellingUnit primary_image').sort({ createdAt: -1 });

        res.status(200).json({ status: 'success', data: subscriptions });

    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        res.status(500).json({ status: 'failed', message: 'Server Error: Could not fetch subscriptions.' });
    }
};
