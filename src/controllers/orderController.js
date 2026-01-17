const Order = require("../models/Order");
const Cart = require("../models/Cart");

// PLACE ORDER
exports.placeOrder = async (req, res) => {
  try {
    // ✅ fetch the cart using the user.cart reference
    const cart = await Cart.findById(req.user.cart).populate("items.productId");

    if (!cart) return res.status(400).json({ message: "Cart not found" });
    if (!cart.items.length) return res.status(400).json({ message: "Cart is empty" });

    // only include items with valid products
    const items = cart.items
      .filter(item => item.productId) // skip deleted products
      .map(item => ({
        product: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
      }));

    if (!items.length) return res.status(400).json({ message: "No valid products in cart" });

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // create the order
    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
    });

    // clear the cart
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error("Place order error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET USER ORDERS
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
