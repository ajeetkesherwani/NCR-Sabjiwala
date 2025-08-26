const bcrypt = require('bcrypt');
const Driver = require('../../../models/driver');

exports.resetPasswordWithOtp = async (req, res) => {
    try {
        const { mobileNo, otp, newPassword } = req.body;

        const driver = await Driver.findOne({ mobileNo });
        if (!driver || driver.otp.code != otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP or mobile number" });
        }

        if (new Date() > driver.otp.expiresAt) {
            return res.status(400).json({ success: false, message: "OTP expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        driver.password = hashedPassword;
        driver.otp.code = null;
        driver.otp.expiresAt = null;

        await driver.save();

        res.json({ success: true, message: "Password reset successful" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
