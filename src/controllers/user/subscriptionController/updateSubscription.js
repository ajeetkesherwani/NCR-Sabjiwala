const Subscription = require("../../../models/subscription");

exports.updateSubscriptionStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const subscriptionId = req.params.id;
        const { status } = req.body;

        // Validate the new status
        const allowedStatus = ['active', 'pause', 'cancle', 'inactive'];
        if (!status || !allowedStatus.includes(status)) {
            return res.status(400).json({status: 'failed', message: `Invalid status. Must be one of: ${allowedStatus.join(', ')}` });
        }

        // Find the subscription belonging to the user
        const subscription = await Subscription.findOne({ _id: subscriptionId, userId: userId });

        if (!subscription) {
            return res.status(404).json({status: 'failed', message: 'Subscription not found.' });
        }

        // Prevent updating a cancelled subscription
        if (subscription.status === 'cancle') {
            return res.status(400).json({status: 'failed', message: 'Cannot update a cancelled subscription.' });
        }

        subscription.status = status;
        const updatedSubscription = await subscription.save();

        // TODO: If status is 'CANCELLED', you might want to add logic here
        // to delete future 'PENDING' deliveries for this subscription.

        res.status(200).json({ status: 'success', data: updatedSubscription });

    } catch (error) {
        console.error('Error updating subscription status:', error);
        res.status(500).json({ status: 'failed', message: 'Server Error' });
    }
};