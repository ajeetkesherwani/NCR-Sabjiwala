const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const walletHistorySchema = new Schema({
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: false }, // shop wise settlement
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: false }, // vendor wise settlement
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: false }, // driver wise settlement
    action: { type: String, required: true }, // e.g., 'credit', 'debit', 'commission', 'withdrawal', 'settlement'
    amount: { type: Number, required: true },
    balance_after_action: { type: Number, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const WalletHistory = mongoose.model('WalletHistory', walletHistorySchema);
module.exports = WalletHistory;
