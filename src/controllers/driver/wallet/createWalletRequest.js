const Driver = require("../../../models/driver");
const WalletRequest = require("../../../models/walletRequest");
const catchAsync = require("../../../utils/catchAsync");

exports.createWalletRequest = catchAsync(async (req, res, next) => {
    try {
        const { amount_requested, message } = req.body;
        const driverId = req.driver._id;

        // Validate the requested amount
        if (!amount_requested || amount_requested <= 0) {
            return res.status(400).json({ message: "Invalid withdrawal amount", status: "notsuccess" });
        }

        // Check if the driver exists
        const driver = await Driver.findById(driverId);
        if (!driver) {
            return res.status(404).json({ message: "Driver not found", status: "notsuccess" });
        }

        // Check if the driver's cash balance is more than zero
        if (driver.cashCollection > 0) {
            return res.status(400).json({
                message: "Cannot raise request: Clear the Cash balance first",
                status: "notsuccess"
            });
        }

        // Check if the driver has sufficient wallet balance
        if (driver.wallet_balance < amount_requested) {
            return res.status(400).json({
                message: "Insufficient wallet balance",
                status: "notsuccess"
            });
        }

        // Create a wallet request for the driver
        const walletRequest = await WalletRequest.create({
            driverId,
            amount_requested,
            message,
            status: "pending",
            admin_settled: false
        });

        return res.status(201).json({
            message: "Withdrawal request submitted successfully",
            status: "success",
            data: walletRequest
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong",
            status: "notsuccess",
            error: error.message
        });
    }
});
