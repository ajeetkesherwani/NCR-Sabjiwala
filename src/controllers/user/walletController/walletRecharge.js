const User = require("../../../models/user");
const WalletHistory = require("../../../models/walletHistory");
const catchAsync = require("../../../utils/catchAsync");

exports.walletRecharge = catchAsync(async (req, res) => {
    // 1. Get amount and payment transaction ID from the request body.
    //    Get the user's ID from the authentication middleware.
    const { amount, transactionId, status } = req.body;
    const userId = req.user.id;

    // 2. Validate the input. The amount must be a positive number.
    if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({
            status: 'failed',
            message: 'Please provide a valid positive amount for the recharge.'
        });
    }

    // 3. Atomically update the user's wallet balance using the $inc operator.
    //    This is crucial to prevent race conditions and ensure data integrity.
    //    'new: true' ensures the updated user document is returned.
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $inc: { wallet: amount } },
        { new: true }
    );

    if (!updatedUser) {
        return res.status(404).json({ status: 'failed', message: 'User not found.' });
    }

    // 4. Create a transaction record in the WalletHistory collection.
    await WalletHistory.create({
        userId: userId,
        action: 'credit',
        amount: amount,
        balance_after_action: updatedUser.wallet,
        description: 'Recharged successfully.',
        paymentMethod: 'online',
        status: status, // 'success' or 'failed'
        transactionId: transactionId || "", // The ID from your payment gateway (e.g., Razorpay, Stripe)
    });

    // 5. Send a success response with the new balance.
    res.status(200).json({
        status: 'success',
        message: `Wallet recharged with ₹${amount}.`,
        newBalance: updatedUser.wallet,
    });
});