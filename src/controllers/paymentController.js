const Razorpay = require("razorpay");
const crypto = require("crypto");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* =======================
   CASH ON DELIVERY
======================= */
exports.placeCodOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart empty" });
    }

    const items = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = item.productId;
      if (!product) continue;

      // Strict Stock Check
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      // Deduct Stock
      product.stock -= item.quantity;
      await product.save();

      items.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image || "/placeholder.png"
      });

      totalAmount += product.price * item.quantity;
    }

    const order = await Order.create({
      user: req.user._id,
      items: items,
      shippingAddress: req.body.shippingAddress,
      totalAmount,
      paymentMethod: "COD",
      paymentStatus: "Pending",
      orderStatus: "Placed",
    });

    cart.items = [];
    await cart.save();

    return res.json({ success: true, order });
  } catch (err) {
    console.error("COD ERROR:", err);
    return res.status(500).json({ success: false, message: "COD failed" });
  }
};

/* =======================
   CREATE RAZORPAY ORDER
======================= */
exports.createRazorpayOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart empty" });
    }

    // CHECK STOCK BEFORE CREATING ORDER
    for (const item of cart.items) {
      if (item.productId.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.productId.name}`
        });
      }
    }

    const totalAmount = cart.items.reduce(
      (sum, i) => sum + i.productId.price * i.quantity,
      0
    );

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    // Create Temporary Order (Pending)
    await Order.create({
      user: req.user._id,
      items: cart.items.map(i => ({
        product: i.productId._id,
        name: i.productId.name,
        price: i.productId.price,
        quantity: i.quantity,
        image: i.productId.image
      })),
      shippingAddress: req.body.shippingAddress,
      totalAmount,
      paymentMethod: "Online",
      paymentStatus: "Pending",
      orderStatus: "Pending",
      razorpayOrderId: razorpayOrder.id,
    });

    return res.json(razorpayOrder);
  } catch (err) {
    console.error("RAZORPAY CREATE ERROR:", err);
    return res.status(500).json({ success: false, message: "Razorpay create failed" });
  }
};

/* =======================
   VERIFY RAZORPAY PAYMENT
======================= */
exports.verifyRazorpay = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Signature mismatch" });
    }

    // SUCCESS: Respond to Client
    res.json({ success: true, message: "Payment verified successfully" });

    // DEDUCT STOCK & FINALIZE
    try {
      const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
      if (order) {
        order.paymentStatus = "Paid";
        order.orderStatus = "Placed";
        order.razorpayPaymentId = razorpay_payment_id;
        await order.save();

        // DEDUCT STOCK
        for (const item of order.items) {
          const product = await Product.findById(item.product);
          if (product) {
            product.stock = Math.max(0, product.stock - item.quantity);
            await product.save();
          }
        }
      }

      await Cart.updateOne({ user: req.user._id }, { $set: { items: [] } });
    } catch (cleanupErr) {
      console.error("POST-PAYMENT CLEANUP FAILED:", cleanupErr);
    }

  } catch (err) {
    console.error("VERIFY ERROR:", err);
    return res.status(500).json({ success: false, message: "Verification failed" });
  }
};
