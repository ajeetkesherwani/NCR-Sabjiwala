const newCart = require("../../../models/newCart");
const User = require("../../../models/user");

exports.clearNewCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const cart = await newCart.findOne({ userId, status: "active" , serivceType: user.serviceType });

        if (!cart) {
            return res.status(404).json({ success: false, message: "No active cart found to clear." });
        }

        // Clear all shops and their items
        cart.shops = [];
        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Cart cleared successfully.",
            cart
        });
    } catch (error) {
        console.error("ClearCart Error:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
