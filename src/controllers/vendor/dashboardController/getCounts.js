const { mongoose } = require("mongoose");
const VendorProduct = require("../../../models/vendorProduct");
const catchAsync = require("../../../utils/catchAsync");
const newOrder = require("../../../models/newOrder");
const Vendor = require("../../../models/vendor");
const { FOOD_SERVICE_ID, MART_SERVICE_ID } = require("../../../utils/constants");


exports.getCounts = async (req, res) => {
    try {
        const vendorId = req.vendor.id;
        if (!vendorId) {
            return res.status(400).json({ error: "Vendor ID is required" });
        }
        const totalFoodProduct = await VendorProduct.countDocuments({ vendorId, serviceId: FOOD_SERVICE_ID, isDeleted: false });
        const totalMartProduct = await VendorProduct.countDocuments({ vendorId, serviceId: MART_SERVICE_ID, isDeleted: false });

        const todayOrder = await newOrder.countDocuments({ vendorId, createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } });
        const walletBalance = await Vendor.findById(vendorId, "wallet_balance");

        res.status(200).json({
            success: true,
            message: "Dashboard counts fetched",
            data: {
                totalFoodProduct,
                totalMartProduct,
                todayOrder,
                walletBalance: walletBalance ? walletBalance.wallet_balance : 0
            }
        });
    } catch (error) {
        console.log(error)
    }
};
