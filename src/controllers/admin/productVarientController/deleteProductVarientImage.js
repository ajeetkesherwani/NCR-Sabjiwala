
const ProductVarient = require('../../../models/productVarient');

exports.deleteProductVarientImage = async (req, res) => {
    try {
        const { productId, variantId } = req.params;
        const { imagePath } = req.body;

        const variant = await ProductVarient.findById(variantId);
        if (!variant) return res.status(404).json({ message: 'Variant not found' });

        const normalize = str => str.replace(/\\/g, '/');

        variant.images = variant.images.filter(img => normalize(img) !== normalize(imagePath));

        await variant.save();

        res.status(200).json({ message: 'Image removed successfully' });
    } catch (err) {
        console.error('Delete image error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
