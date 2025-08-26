const cart = require("../../../models/cart");
require("../../../models/toppins");

exports.getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch cart items with product and topping details
        // const cartItems = await cart.find({ userId, status: "active" }).populate("productId").populate("toppings.toppingId").populate("productId.vendorId");

        const cartItems = await cart.find({ userId, status: "active" }).populate([
            { path: "productId", populate: { path: "vendorId" } },
            { path: "toppings.toppingId" }
        ])

        // console.log("Cart Items:", cartItems);

        // Transform the cart items to return only required fields
        const items = cartItems.map(item => ({
            cart_id: item._id,
            user_id: item.userId,
            product_id: item.productId?._id,
            primary_image: item.productId?.primary_image,
            name: item.productId?.name,
            vendorName: item.productId?.vendorId?.name,
            shortDescription: item.productId?.shortDescription,
            price: item.productId?.vendorSellingPrice,
            toppings: item.toppings.map(topping => ({
                topping_id: topping.toppingId?._id,
                name: topping.toppingId?.name,
                price: topping.price
            }))
        }));

        const subTotal = cartItems.reduce((sum, item) => sum + item.finalPrice, 0);

        return res.status(200).json({
            success: true,
            items,
            subTotal,
            total: subTotal
        });

    } catch (error) {
        console.error("GetCart Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while retrieving cart.",
            error: error.message
        });
    }
};
