const banner = require("../../../models/dealBanner");
const Category = require("../../../models/category");
const Driver = require("../../../models/driver");
const Order = require("../../../models/order");
const Product = require("../../../models/product");
const User = require("../../../models/user");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllData = catchAsync(async (req, res, next) => {
  try {
    const categories = await Category.find({ cat_id: null });
    const subCategories = await Category.find({ cat_id: { $ne: null } });
    const products = await Product.countDocuments();
    const bannerCount = await banner.countDocuments();
    const driverCount = await Driver.countDocuments();
    const userCount = await User.countDocuments();
    const orderCount = await Order.countDocuments();

    let countData = {
      banner: bannerCount || 10,
      category: categories.length,
      subCategory: subCategories.length,
      products,
      driver: driverCount || 10,
      user: userCount || 10,
      order: orderCount || 10,
    };

    return res
      .status(200)
      .json({ success: true, message: "Data found", data: { countData } });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
