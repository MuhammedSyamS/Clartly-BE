const Razorpay = require("razorpay");
const crypto = require("crypto");
const Product = require("../models/Product");
const Order = require("../models/Order");

// Initialize Razorpay instance
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
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }
      amount += product.price * item.quantity;
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Rupees → Paise
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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Payment details missing" });
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Save order in DB
    const order = new Order({
      user: req.user._id, // ✅ from auth middleware
      products: req.body.cartItems || [], // optional
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: "paid",
      createdAt: new Date(),
    });

    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    console.error("Verify payment error:", err);
    res.status(500).json({ message: "Payment verification failed" });
  }
};
