const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  // VENDOR DETAILS
  name: { type: String },
  userId: { type: String, unique: true },
  password: { type: String },
  mobile: { type: String },
  alternateMobile: { type: String, default: '' },
  email: { type: String, default: '' },
  profileImg: { type: String, default: '' },

  // DOCUMENTS DETAILS 
  panNo: { type: String },
  gstNo: { type: String, default: '0' },
  foodLicense: { type: String, default: '0' },
  panImage: { type: String, default: '' },
  gstImage: { type: String, default: '0' },
  foodImage: { type: String, default: '' },


  // BANK DETAILS (now handled in Vendor model directly)
  ifsc: { type: String, default: '' },
  bankName: { type: String, default: '' },
  branchName: { type: String, default: '' },
  accountNo: { type: String, default: '' },
  benificiaryName: { type: String, default: '' },
  passbook: { type: String, default: '' },
  commission: { type: Number, default: 0 },
  wallet_balance: { type: Number, default: 0 },
  isBlocked: { type: Boolean, default: false },
  agreementAccepted: { type: String, default: 'true' },
  status: { type: Boolean, default: false },

  // payouts
  payoutType: {type: String, enum:['daily', 'weekly', 'monthly'], default: 'weekly'},

  // for firebase cloud messaging
  deviceId: { type: String, default: '' },
  deviceToken: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Vendor = mongoose.model("Vendor", vendorSchema);
module.exports = Vendor;
