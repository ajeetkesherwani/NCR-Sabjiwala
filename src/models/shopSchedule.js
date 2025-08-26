const mongoose = require("mongoose");

const shopScheduleSchema = mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: true
    },
    schedule: [
        {
            day: {
                type: String,
                enum: [
                    "Monday", "Tuesday", "Wednesday", "Thursday",
                    "Friday", "Saturday", "Sunday"
                ],
            },
            openTime: {
                type: String, // Store in 24-hour format e.g., "09:00"
            },
            closeTime: {
                type: String, // Store in 24-hour format e.g., "21:00"
            },
            isClosed: {
                type: Boolean, // If true, the shop is closed on this day
                default: false
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ShopSchedule = mongoose.model("ShopSchedule", shopScheduleSchema);
module.exports = ShopSchedule;
