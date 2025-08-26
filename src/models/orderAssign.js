const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AssignmentSchema = new Schema({
    orderId: { type: Schema.Types.ObjectId, ref: 'newOrder', required: true },
    driverId: { type: Schema.Types.ObjectId, ref: 'Driver', required: true },
    assignedAt: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['assigned', 'accepted', 'rejected', 'cancelled'],
        default: 'assigned'
    },
    respondedAt: { type: Date, default: null }, // when driver accepted/rejected
    remarks: { type: String, default: '' } // optional notes or reason for rejection
});

const OrderAssign = mongoose.model('OrderAssign', AssignmentSchema);
module.exports = OrderAssign;
