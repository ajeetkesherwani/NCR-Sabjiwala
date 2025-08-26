const Driver = require("../../../models/driver");

exports.findDriver = async (req, res) => {
    try {
        const { mobile } = req.body;
        if (!mobile) return res.json({ success: false, message: "Mobile number is required" });

        const driver = await Driver.findOne({ mobileNo: mobile });
        if (!driver) return res.json({ success: false, message: "Driver not found" });

        res.json({ success: true, driver });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
