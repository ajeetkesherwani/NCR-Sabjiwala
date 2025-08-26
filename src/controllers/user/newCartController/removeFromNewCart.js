const newCart = require("../../../models/newCart");
const User = require("../../../models/user");

exports.removeFromNewCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { shopId, productId } = req.body;

        if (!shopId) {
            return res.status(400).json({ message: "shopId is required." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const cart = await newCart.findOne({ userId, status: "active", serviceType: user.serviceType });
        if (!cart) return res.status(404).json({ message: "Cart not found." });

        const shopIndex = cart.shops.findIndex(shop => shop.shopId.equals(shopId));
        if (shopIndex === -1) return res.status(404).json({ message: "Shop not found in cart." });

        if (productId) {
            // Remove specific product from this shop
            const shop = cart.shops[shopIndex];
            shop.items = shop.items.filter(item => !item.productId.equals(productId));

            // If no products left, remove the entire shop group
            if (shop.items.length === 0) {
                cart.shops.splice(shopIndex, 1);
            }
        } else {
            // Only shopId provided — remove the entire shop section
            cart.shops.splice(shopIndex, 1);
        }

        await cart.save();
        return res.status(200).json({ success: true, message: "Cart updated successfully", cart });
    } catch (error) {
        console.error("RemoveFromCart Error:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
