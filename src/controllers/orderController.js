const Order = require("../models/Order");
const Product = require("../models/Product");
const mongoose = require("mongoose");

// PLACE ORDER (COD or Online)
exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user._id; // from authMiddleware
    const { cartItems, shippingAddress, paymentMethod, paymentDetails } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Prepare order items
    const items = [];
    let totalAmount = 0;

    for (const item of cartItems) {
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        return res.status(400).json({ message: `Invalid product ID: ${item.productId}` });
      }

      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }

      items.push({
        product: product._id,
        name: product.name,
        image: product.image,
        quantity: item.quantity,
        price: product.price,
      });

      totalAmount += product.price * item.quantity;
    }

    // Create order
    const order = new Order({
      user: userId,
      items,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "Pending" : "Paid",
    });

    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    console.error("Place order error:", err);
    res.status(500).json({ message: "Failed to place order" });
  }
};
