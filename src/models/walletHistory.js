const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const walletHistorySchema = new Schema({
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: false }, // shop wise settlement
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: false }, // vendor wise settlement
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: false }, // driver wise settlement
<<<<<<< HEAD
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // driver wise settlement
=======
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // user wise settlement
>>>>>>> 506cc98bccb177dbb020d33ce27de1504c36e82b
    action: { type: String, required: true }, // e.g., 'credit', 'debit', 'commission', 'withdrawal', 'settlement'
    amount: { type: Number, required: true },
    balance_after_action: { type: Number, required: true },
    description: { type: String, default: "" },
    paymentMethod: { type: String, enum: ['cash', 'online', 'wallet'], default: 'wallet' },
    status: { type: String, enum: ['success', 'failed'], default: 'success' },
    transactionId: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
});

const WalletHistory = mongoose.model('WalletHistory', walletHistorySchema);
module.exports = WalletHistory;
