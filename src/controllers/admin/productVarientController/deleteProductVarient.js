const ProductVarient = require('../../../models/productVarient');
const Product = require('../../../models/product');
const fs = require('fs');
const path = require('path');

exports.deleteProductVarient = async (req, res) => {
    try {
        const { productId, variantId } = req.params;

        // 1. Find the variant
        const variant = await ProductVarient.findById(variantId);
        if (!variant) {
            return res.status(404).json({ message: 'Variant not found' });
        }

        // 2. Delete the variant
        await ProductVarient.findByIdAndDelete(variantId);

        // 3. Remove variant reference from the product
        await Product.findByIdAndUpdate(productId, {
            $pull: { variants: variantId }
        });

        return res.status(200).json({ message: 'Product variant deleted successfully' });

    } catch (err) {
        console.error('Error deleting product variant:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
