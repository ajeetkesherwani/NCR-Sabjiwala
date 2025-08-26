const VendorProduct = require("../../../models/vendorProduct");
const Shop = require("../../../models/shop");
const newCart = require("../../../models/newCart");
const User = require("../../../models/user");

exports.createNewCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            productId,
            price,
            quantity = 1,
            toppings = [], // [{ toppingId, price }]
        } = req.body;

        // Basic validations
        if (!productId || typeof price !== "number" || price < 0 || quantity < 1) {
            return res.status(400).json({ message: "Invalid product or price or quantity." });
        }

        for (const t of toppings) {
            if (!t.toppingId || typeof t.price !== "number" || t.price < 0) {
                return res.status(400).json({ message: "Invalid topping data." });
            }
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Get shop & vendor from product
        const product = await VendorProduct.findById(productId).populate("shopId vendorId");
        if (!product) return res.status(404).json({ message: "Product not found." });

        const shopId = product.shopId._id;
        const vendorId = product.vendorId._id;

        // Calculate finalPrice
        const toppingsCost = toppings.reduce((sum, t) => sum + t.price, 0);
        const finalPrice = (price + toppingsCost) * quantity;

        // Find existing cart
        let cart = await newCart.findOne({ userId, status: "active", serviceType: user.serviceType });

        if (!cart) {
            // If cart doesn't exist, create one
            cart = new newCart({
                userId,
                serviceType: user.serviceType,
                shops: [{
                    shopId,
                    vendorId,
                    items: [{
                        productId,
                        price,
                        quantity,
                        toppings,
                        finalPrice
                    }]
                }]
            });
        } else {
            // Check if shop group exists
            const shopGroup = cart.shops.find(s => s.shopId.equals(shopId));
            if (shopGroup) {
                // Check if product already exists in the shop group
                const existingItem = shopGroup.items.find(item => item.productId.equals(productId));

                if (existingItem) {
                    // If product exists, update quantity and finalPrice
                    existingItem.quantity += quantity;
                    existingItem.finalPrice += finalPrice;
                } else {
                    // Add item to existing shop group
                    shopGroup.items.push({ productId, price, quantity, toppings, finalPrice });
                }
            } else {
                // Add new shop group
                cart.shops.push({
                    shopId,
                    vendorId,
                    items: [{ productId, price, quantity, toppings, finalPrice }]
                });
            }
        }

        await cart.save();
        return res.status(200).json({ success: true, message: "Item added to cart", cart });
    } catch (error) {
        console.error("AddToCart Error:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};


// exports.createNewCart = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const {
//             productId,
//             price,
//             quantity = 1,
//             toppings = [], // [{ toppingId, price }]
//         } = req.body;

//         // Basic validations
//         if (!productId || typeof price !== "number" || price < 0 || quantity < 1) {
//             return res.status(400).json({ message: "Invalid product or price or quantity." });
//         }

//         for (const t of toppings) {
//             if (!t.toppingId || typeof t.price !== "number" || t.price < 0) {
//                 return res.status(400).json({ message: "Invalid topping data." });
//             }
//         }

//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: "User not found." });
//         }

//         // Get shop & vendor from product
//         const product = await VendorProduct.findById(productId).populate("shopId vendorId");
//         if (!product) return res.status(404).json({ message: "Product not found." });

//         const shopId = product.shopId._id;
//         const vendorId = product.vendorId._id;

//         // Calculate finalPrice
//         const toppingsCost = toppings.reduce((sum, t) => sum + t.price, 0);
//         const finalPrice = (price + toppingsCost) * quantity;

//         // Find existing cart
//         let cart = await newCart.findOne({ userId, status: "active", serviceType: user.serviceType });

//         if (!cart) {
//             // If cart doesn't exist, create one
//             cart = new newCart({
//                 userId,
//                 serviceType: user.serviceType,
//                 shops: [{
//                     shopId,
//                     vendorId,
//                     items: [{
//                         productId,
//                         price,
//                         quantity,
//                         toppings,
//                         finalPrice
//                     }]
//                 }]
//             });
//         } else {
//             // Check if shop group exists
//             const shopGroup = cart.shops.find(s => s.shopId.equals(shopId));
//             if (shopGroup) {
//                 // Add item to existing shop group
//                 shopGroup.items.push({ productId, price, quantity, toppings, finalPrice });
//             } else {
//                 // Add new shop group
//                 cart.shops.push({
//                     shopId,
//                     vendorId,
//                     items: [{ productId, price, quantity, toppings, finalPrice }]
//                 });
//             }
//         }

//         await cart.save();
//         return res.status(200).json({ success: true, message: "Item added to cart", cart });
//     } catch (error) {
//         console.error("AddToCart Error:", error);
//         return res.status(500).json({ success: false, message: "Server error", error: error.message });
//     }
// };
