// controllers/cartController.js
const Cart = require('../../../models/cart');

exports.createCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            productId,
            price,
            quantity = 1,
            toppings = [],      // expect [{ toppingId, price }, …]
        } = req.body;

        // Validate required fields
        if (!productId) {
            return res.status(400).json({ message: 'productId is required.' });
        }
        if (typeof price !== 'number' || price < 0) {
            return res.status(400).json({ message: 'price must be a non-negative number.' });
        }
        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({ message: 'quantity must be an integer ≥ 1.' });
        }
        if (!Array.isArray(toppings)) {
            return res.status(400).json({ message: 'toppings must be an array.' });
        }
        // Validate each topping entry
        for (const t of toppings) {
            if (!t.toppingId) {
                return res.status(400).json({ message: 'Each topping needs a toppingId.' });
            }
            if (typeof t.price !== 'number' || t.price < 0) {
                return res.status(400).json({ message: 'Each topping.price must be a non-negative number.' });
            }
        }

        // Build and save the Cart line-item
        const cartLine = new Cart({
            userId,
            productId,
            price,
            quantity,
            toppings,
        });

        await cartLine.validate();  // runs pre('validate') to compute finalPrice
        await cartLine.save();

        return res.status(201).json({ success: true, cart: cartLine });
    } catch (error) {
        console.error('CreateCart Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while creating cart item.',
            error: error.message,
        });
    }
};
