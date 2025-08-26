const Subscription = require("../../../models/subscription");

exports.getSubscriptionById = async (req, res) => {
    try {
        const userId = req.user.id;
        const subscriptionId = req.params.id;

        const subscription = await Subscription.findById(subscriptionId).populate('productId');

        // Check if subscription exists and belongs to the user
        if (!subscription || subscription.userId.toString() !== userId) {
            return res.status(404).json({ status: 'failed', message: 'Subscription not found.' });
        }

        res.status(200).json({ status: 'success', data: subscription });

    } catch (error) {
        console.error('Error fetching subscription by ID:', error);
        res.status(500).json({ status: 'failed', message: 'Server Error' });
    }
};