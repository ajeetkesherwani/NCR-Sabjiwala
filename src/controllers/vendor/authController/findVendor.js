const Vendor = require("../../../models/vendor");

exports.findVendor = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.json({ success: false, message: "User Id is required" });

        const vendor = await Vendor.findOne({ userId });
        if (!vendor) return res.json({ success: false, message: "Vendor not found" });

        res.json({ success: true, vendor });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
