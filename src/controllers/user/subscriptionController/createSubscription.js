const Subscription = require("../../../models/subscription");
const VendorProduct = require("../../../models/vendorProduct");

exports.createSubscription = async (req, res) => {
    try {
        const { productId, quantity, startDate, frequency } = req.body;
        const userId = req.user.id;

        if (!productId || !quantity || !startDate || !frequency || !frequency.type) {
            return res.status(400).json({ status: 'failed', message: 'Please provide all required fields.' });
        }

        const product = await VendorProduct.findById(productId);
        if (!product || !product.isSubscribable) {
            return res.status(404).json({ status: 'failed', message: 'Product not found or is not available for subscription.' });
        }

        // 1. --- UPDATED --- Validate frequency rules for the new model
        if (frequency.type === 'weekly' && (!frequency.daysOfWeek || !Array.isArray(frequency.daysOfWeek) || frequency.daysOfWeek.length === 0)) {
            return res.status(400).json({ status: 'failed', message: 'For a weekly subscription, a valid array of daysOfWeek is required.' });
        }
        if (frequency.type === 'monthly' && (!frequency.daysOfMonth || !Array.isArray(frequency.daysOfMonth) || frequency.daysOfMonth.length === 0)) {
            return res.status(400).json({ status: 'failed', message: 'For a monthly subscription, a valid array of daysOfMonth is required.' });
        }

        // 2. --- NEW --- Create a clean frequency object to avoid validation errors
        let cleanFrequency = { type: frequency.type };
        switch (frequency.type) {
            case 'weekly':
                cleanFrequency.daysOfWeek = frequency.daysOfWeek;
                break;
            case 'monthly':
                cleanFrequency.daysOfMonth = frequency.daysOfMonth;
                break;
            // For 'daily', 'alternateDay', etc., no extra fields are needed.
        }

        // 3. Create and save the new subscription using the clean object
        const newSubscription = new Subscription({
            userId,
            productId,
            quantity,
            startDate: new Date(startDate),
            frequency: cleanFrequency, // Use the cleaned object here
        });

        const savedSubscription = await newSubscription.save();

        res.status(201).json({ status: 'success', data: savedSubscription });

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ status: 'failed', message: error.message });
        }
        console.error('Error creating subscription:', error);
        res.status(500).json({ status: 'failed', message: 'Server Error.' });
    }
};