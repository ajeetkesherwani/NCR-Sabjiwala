const Driver = require("../../../models/driver");
const sendSmsOtp = require("../../../utils/sendSmsOtp");


exports.requestPasswordReset = async (req, res) => {
    try {
        const { mobileNo } = req.body;

        const driver = await Driver.findOne({ mobileNo });
        if (!driver) {
            return res.status(404).json({ success: false, message: "Driver not found" });
        }

        // const otp = 1234
        const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
        const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        driver.otp = {
            code: otp,
            expiresAt: expiry
        }
        await driver.save();

        // TODO: Replace with actual SMS service
        try {
            await sendSmsOtp(mobileNo, otp);
            console.log("OTP sent successfully");
        } catch (error) {
            console.error("Failed to send OTP:", error.message || error);
            return res.status(500).json({
                success: false,
                message: "Failed to send OTP"
            });
        }

        res.json({ success: true, message: "OTP sent successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
