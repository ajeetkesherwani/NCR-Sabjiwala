const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    addressType: {
      type: String,
      enum: ["home", "work", "other"], // example options
      required: true,
      trim: true,
    },
    floor: { type: String, trim: true },
    houseNoOrFlatNo: { type: String, required: true, trim: true },
    landmark: { type: String, trim: true },
    pincode: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    receiverName: { type: String, required: true, trim: true },
    receiverNo: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const userAddressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    addresses: [addressSchema], // array of addresses for user
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserAddress", userAddressSchema);
