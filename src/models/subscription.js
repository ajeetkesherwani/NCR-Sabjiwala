const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "VendorProduct", required: true },
    quantity: { type: Number, required: true },
    startDate: { type: Date, default: Date.now },

    frequency: {
        type: {
            type: String,
            required: true,
            enum: ["daily", "alternateDay", "every3Day", "weekly", "monthly"],
        },
        // Used for 'weekly' subscriptions (e.g., 0 for Sunday, 6 for Saturday)
        daysOfWeek: {
            type: [Number], // Array of numbers (0=Sun, 1=Mon, ..., 6=Sat)
            default: null
        },
        // Used for 'monthly' subscriptions (stores multiple days)
        daysOfMonth: {
            type: [Number],
            validate: [
                // This function now checks if 'val' exists before reading its length
                (val) => {
                    if (val === null || val === undefined) return true; // It's valid if not provided
                    return val.length > 0 && val.length <= 5;
                },
                'For monthly subscriptions, please provide between 1 and 5 days.'
            ],
            default: null
        }
    },
    status: {
        type: String,
        enum: ["active", "pause", "cancle", "inactive"],
        default: "active"
    },
}, { timestamps: true });

const Subscription = mongoose.model("Subscription", subscriptionSchema); // Changed model name to singular for convention
module.exports = Subscription;