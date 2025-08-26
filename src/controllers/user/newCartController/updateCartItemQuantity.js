const newCart = require("../../../models/newCart");
const User = require("../../../models/user");

exports.updateCartItemQuantity = async (req, res) => {
    try {
        const userId = req.user.id;
        const { shopId, productId, quantity } = req.body;

        if (!shopId || !productId || !Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({ message: "Invalid shopId, productId, or quantity." });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found." });

        const cart = await newCart.findOne({ userId, status: "active", serviceType: user.serviceType })
        if (!cart) return res.status(404).json({ message: "Cart not found." });

        const shop = cart.shops.find(s => s.shopId.equals(shopId));
        if (!shop) return res.status(404).json({ message: "Shop not found in cart." });

        const item = shop.items.find(i => i.productId.equals(productId));
        if (!item) return res.status(404).json({ message: "Product not found in cart." });

        // Update quantity and recalculate finalPrice
        item.quantity = quantity;
        const toppingsCost = item.toppings.reduce((sum, t) => sum + t.price, 0);
        item.finalPrice = (item.price + toppingsCost) * quantity;

        await cart.save();
        return res.status(200).json({ success: true, message: "Quantity updated", cart });
    } catch (error) {
        console.error("UpdateCartItemQuantity Error:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
