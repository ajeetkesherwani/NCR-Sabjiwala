const Cart = require("../../../models/cart");
const Product = require("../../../models/product");
const catchAsync = require("../../../utils/catchAsync");

exports.addToCart = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { productId, variantId, quantity } = req.body;

  if (!productId) {
    return res
      .status(400)
      .json({ success: false, message: "ProductId is required" });
  }

  const qty = quantity && quantity > 0 ? quantity : 1;

  // Fetch product details for price etc.
  const product = await Product.findById(productId).lean();
  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  // Determine price for variant or product
  let price;
  if (variantId) {
    const variant = product.variants.find(
      (v) => v._id.toString() === variantId
    );
    if (!variant) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid variantId" });
    }
    price = variant.price;
  } else {
    price = product.price;
  }

  // Find user's cart or create new
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, products: [] });
  }

  // Check if product with same variant already exists in cart
  const existingProductIndex = cart.products.findIndex(
    (p) =>
      p.productId.toString() === productId &&
      ((variantId && p.variantId && p.variantId.toString() === variantId) ||
        (!variantId && !p.variantId))
  );

  if (existingProductIndex > -1) {
    // Update quantity and price
    cart.products[existingProductIndex].quantity += qty;
    cart.products[existingProductIndex].price = price; // Optionally update price
  } else {
    // Add new product entry
    cart.products.push({
      productId,
      variantId: variantId || null,
      quantity: qty,
      price,
    });
  }

  cart.updatedAt = new Date();

  await cart.save();

  return res.status(200).json({
    success: true,
    message: "Product added to cart successfully",
    cart,
  });
});
