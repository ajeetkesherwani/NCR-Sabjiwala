const mongoose = require("mongoose");

const dealBannerSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
      trim: true,
    },
    bannerImages: [
      {
        type: String,
        trim: true,
        required: true,
      },
    ],
    productIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DealBanner", dealBannerSchema);
