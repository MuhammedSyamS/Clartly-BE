const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Order = require("../models/Order");
const Product = require("../models/Product");

// PLACE ORDER (COD or Online)
router.post("/place", authMiddleware, async (req, res) => {
  try {
    const { cartItems, shippingAddress, paymentMethod, paymentDetails, userId } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Validate products & calculate total
    let totalAmount = 0;
    for (const item of cartItems) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Product not found: ${item.productId}` });
      totalAmount += product.price * item.quantity;
    }

    const order = new Order({
      user: userId,
      products: cartItems,
      shippingAddress,
      paymentMethod,
      paymentDetails: paymentDetails || {},
      totalAmount,
      status: paymentMethod === "cod" ? "pending" : "paid",
      createdAt: new Date(),
    });

    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    console.error("Place order error:", err);
    res.status(500).json({ message: "Failed to place order" });
  }
});

module.exports = router;
