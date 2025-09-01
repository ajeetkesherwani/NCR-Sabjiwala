const mongoose = require("mongoose");
const Category = require("../../../models/category");
const User = require("../../../models/user");
const { calculateOffer } = require("../../../utils/calculateOffer");
const catchAsync = require("../../../utils/catchAsync");
const Product = require("../../../models/product");

exports.getProductDetail = catchAsync(async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // test - 6848061dd9a8dae4b3b21c4b
    const product = await Product.findById(req.params.productId).populate({
      path: "variants",
      select: "name images price originalPrice discount stock unit",
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      productData: product,
    });
  } catch (error) {
    console.error("Error in get product details controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});
