const Cart = require("../models/Cart");
const Product = require("../models/Product");

// =====================
// GET CART
// =====================
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.productId");

    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    // 🔒 SAFETY: filter out null products
    const items = cart.items
      .filter(item => item.productId) // THIS LINE FIXES YOUR CRASH
      .map(item => ({
        id: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        image: item.productId.image,
        quantity: item.quantity,
      }));

    res.status(200).json({ items });
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

// =====================
// ADD TO CART
// =====================
exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({
        productId,
        quantity: 1,
      });
    }

    await cart.save();
    res.status(200).json({ message: "Added to cart" });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: "Failed to add to cart" });
  }
};

// =====================
// REMOVE FROM CART
// =====================
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );

    await cart.save();
    res.status(200).json({ message: "Item removed from cart" });
  } catch (err) {
    console.error("Remove cart error:", err);
    res.status(500).json({ message: "Failed to remove item" });
  }
};
