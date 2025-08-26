const cron = require('node-cron');
const mongoose = require('mongoose');
const { startOfTomorrow, differenceInDays, getDay, getDate } = require('date-fns');
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

// --- IMPORT ALL NECESSARY MODELS (Update paths as needed) ---
const Subscription = require('./src/models/subscription');
const User = require('./src/models/user');
const Address = require('./src/models/address');
const newOrder = require('./src/models/newOrder');
const WalletHistory = require('./src/models/walletHistory');

const DB_URI = process.env.DB_URL;
console.log(process.env.DB_URL)

const scheduleDeliveries = async () => {
    console.log('Running the subscription order creation job...');

    try {
        const targetDate = startOfTomorrow();
        console.log(`Scheduling subscription orders for: ${targetDate.toDateString()}`);

        const subscriptions = await Subscription.find({ status: 'active' })
            .populate({
                path: 'productId',
                populate: { path: 'shopId' }
            });

        if (!subscriptions.length) {
            console.log('No active subscriptions found. Job finished.');
            return;
        }

        for (const sub of subscriptions) {
            if (targetDate < sub.startDate) {
                continue;
            }

            let isDeliveryDay = false;

            // --- THIS IS THE FULLY IMPLEMENTED FREQUENCY LOGIC ---
            switch (sub.frequency.type) {
                case 'daily':
                    isDeliveryDay = true;
                    break;
                case 'alternateDay':
                    if (differenceInDays(targetDate, sub.startDate) % 2 === 0) {
                        isDeliveryDay = true;
                    }
                    break;
                case 'every3Day':
                    if (differenceInDays(targetDate, sub.startDate) % 3 === 0) {
                        isDeliveryDay = true;
                    }
                    break;
                case 'weekly':
                    // Handles the 'dayOfWeek' array for multiple days
                    if (sub.frequency.dayOfWeek && sub.frequency.dayOfWeek.includes(getDay(targetDate))) {
                        isDeliveryDay = true;
                    }
                    break;
                case 'monthly':
                    // Handles the 'daysOfMonth' array
                    if (sub.frequency.daysOfMonth && sub.frequency.daysOfMonth.includes(getDate(targetDate))) {
                        isDeliveryDay = true;
                    }
                    break;
            }

            if (isDeliveryDay) {
                // --- The rest of the order creation logic is below ---

                const product = sub.productId;
                if (!product || !product.shopId) {
                    console.warn(`Subscription ${sub._id} has a missing product or shop link. Skipping.`);
                    continue;
                }

                const userDefaultAddress = await Address.findOne({ userId: sub.userId, isDefault: true });
                if (!userDefaultAddress) {
                    console.warn(`User ${sub.userId} has no default address set. Skipping subscription ${sub._id}.`);
                    continue;
                }

                const itemPrice = Number(product.vendorSellingPrice);
                const itemTotal = itemPrice * sub.quantity;
                const packingCharge = product.shopId.packingCharge || 0;
                const deliveryCharge = 10;
                const finalTotalPrice = itemTotal + packingCharge + deliveryCharge;

                const session = await mongoose.startSession();
                session.startTransaction();

                try {
                    const user = await User.findById(sub.userId).session(session);

                    if (!user || user.wallet < finalTotalPrice) {
                        console.warn(`Insufficient funds for user ${sub.userId}. Order for subscription ${sub._id} skipped.`);
                        await session.abortTransaction();
                        continue;
                    }

                    const orderCount = await newOrder.countDocuments().session(session);
                    const booking_id = `ORDSUB${(orderCount + 1).toString().padStart(4, '0')}`;

                    const order = new newOrder({
                        booking_id,
                        shopId: product.shopId._id,
                        vendorId: product.vendorId,
                        productData: [{
                            productId: product._id,
                            price: itemPrice,
                            quantity: sub.quantity,
                            toppings: [],
                            finalPrice: itemPrice
                        }],
                        itemTotal,
                        afterCouponAmount: itemTotal,
                        userId: sub.userId,
                        addressId: userDefaultAddress._id,
                        deliveryDate: targetDate,
                        deliveryTime: "9AM - 1PM",
                        deliveryCharge,
                        packingCharge,
                        finalTotalPrice,
                        orderStatus: 'accepted',
                        paymentMode: 'wallet',
                        paymentStatus: 'paid',
                    });

                    const savedOrder = await order.save({ session });

                    const updatedUser = await User.findByIdAndUpdate(sub.userId,
                        { $inc: { wallet: -finalTotalPrice } },
                        { session, new: true }
                    );

                    await WalletHistory.create([{
                        userId: sub.userId,
                        action: 'debit',
                        amount: finalTotalPrice,
                        balance_after_action: updatedUser.wallet,
                        description: `Subscription order ${booking_id} created`,
                        transactionId: savedOrder._id.toString(),
                    }], { session });

                    await session.commitTransaction();
                    console.log(`✅ Order ${booking_id} created for user ${sub.userId} from subscription ${sub._id}.`);

                } catch (error) {
                    await session.abortTransaction();
                    console.error(`❌ Transaction failed for subscription ${sub._id}:`, error);
                } finally {
                    session.endSession();
                }
            }
        }
    } catch (error) {
        console.error('❌ Major error in subscription order scheduler:', error);
    }
};

const startScheduler = async () => {
    try {
        mongoose
            .connect(DB_URI)
            .then(() => console.log("Connection created successfully."))
            .catch((err) => console.log(err));
        console.log('MongoDB connected for scheduler.');

        cron.schedule('5 0 * * *', scheduleDeliveries, {
            scheduled: true,
            timezone: "Asia/Kolkata"
        });

        console.log('Scheduler started. Waiting for the scheduled time to run the job...');

    } catch (error) {
        console.error('Could not connect to MongoDB for scheduler:', error);
        process.exit(1);
    }
};

startScheduler();

module.exports = { scheduleDeliveries }