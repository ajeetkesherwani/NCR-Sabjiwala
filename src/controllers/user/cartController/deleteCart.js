const cart = require("../../../models/cart");

exports.deleteCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cartItemId = req.params.cartItemId;

        const deleted = await cart.findOneAndDelete({ _id: cartItemId, userId });

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found or already deleted."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cart item deleted successfully.",
            cart_id: deleted._id
        });

    } catch (error) {
        console.error("DeleteCartItem Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while deleting cart item.",
            error: error.message
        });
    }
};
