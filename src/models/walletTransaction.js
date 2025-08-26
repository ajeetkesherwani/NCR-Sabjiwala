const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const walletTransactionSchema = new Schema({
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true }, 
    amount: { type: Number, required: true, default: "0" }, 
    commission: { type: Number, required: true, default: "0" }, 
    commission_amount: { type: Number, required: true, default: "0" }, 
    gst: { type: Number, required: true, default: "0" }, 
    gst_amount: { type: Number, required: true, default: "0" }, 
    type: {type: String, enum: ["Order Payment", "Admin Bonus"]},
    is_bonus : {type: Boolean, default: false},  // this will true when 10th series order come and then only 10% commission charge
    final_amount: { type: Number, required: true }, // Final amount after commission deduction
    createdAt: { type: Date, default: Date.now },
});

const WalletTransaction = mongoose.model('WalletTransaction', walletTransactionSchema);
module.exports = WalletTransaction;
