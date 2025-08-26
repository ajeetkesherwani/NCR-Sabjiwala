const User = require("../../../models/user");

exports.findUser = async (req, res) => {
    try {
        const { mobile } = req.body;
        if (!mobile) return res.json({ success: false, message: "Mobile number is required" });

        const user = await User.findOne({ mobileNo: mobile });
        if (!user) return res.json({ success: false, message: "User not found" });

        res.json({ success: true, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
