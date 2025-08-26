const Shop = require("../../../models/shop");
const Vendor = require("../../../models/vendor");
const WalletTransaction = require("../../../models/walletTransaction");
const catchAsync = require("../../../utils/catchAsync");

exports.getShopWalletHistory = catchAsync(async (req, res, next) => {
    try {

        const vendorId = req.vendor._id
        const shopId = req.params.shopId;

        const vendorDetails = await Vendor.findById(vendorId);
        const shopDetails = await Shop.findById(shopId)
        const WalletTransactionHistory = await WalletTransaction.find({ shopId }).sort({ createdAt: -1 }).lean()

        // Calculate 7-day totals
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const last7DaysTransactions = WalletTransactionHistory.filter(txn => {
            return new Date(txn.createdAt) >= sevenDaysAgo;
        });

        const totalOrdersAmount = last7DaysTransactions.reduce((sum, txn) => sum + (txn.amount || 0), 0);
        const totalCommission = last7DaysTransactions.reduce((sum, txn) => sum + (txn.commission_amount || 0), 0);
        const finalWalletBalance = last7DaysTransactions.reduce((sum, txn) => sum + (txn.final_amount || 0), 0);

        return res.status(200).json({
            status: "success",
            message: "Shop wallet history fetched successfully.",
            vendorDetails,
            shopDetails,
            WalletTransactionHistory,
            last7DaysSummary: {
                totalOrdersAmount,
                totalCommission,
                finalWalletBalance
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong", status: "notsuccess", error: error.message });
    }
})