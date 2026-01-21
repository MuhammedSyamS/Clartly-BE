const Razorpay = require("razorpay");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const Order = require("../models/Order");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ========================== CREATE RAZORPAY ORDER ==========================
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { cartItems } = req.body; // [{ productId, quantity }]

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total amount & validate products
    let amount = 0;
    for (const item of cartItems) {
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        return res.status(400).json({ message: `Invalid product ID: ${item.productId}` });
      }

      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }

      amount += product.price * item.quantity;
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert rupees → paise
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
    });

    res.json({ order, cartItems });
  } catch (err) {
    console.error("Razorpay order error:", err);
    res.status(500).json({ message: "Razorpay order failed" });
  }
};

// ========================== VERIFY PAYMENT ==========================
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cartItems, userId } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Save order in DB
    const order = new Order({
      user: userId,
      products: cartItems, // [{ productId, quantity }]
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: "paid",
      createdAt: new Date(),
    });

    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ message: "Verification failed" });
  }
};
