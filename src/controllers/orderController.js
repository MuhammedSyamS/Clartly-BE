const Order = require("../models/Order");
const Product = require("../models/Product");
const mongoose = require("mongoose");

// =======================
// PLACE ORDER (COD ONLY)
// =======================
exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { cartItems, shippingAddress, paymentMethod } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const method = paymentMethod?.toUpperCase();
    if (method !== "COD") {
      return res.status(400).json({ success: false, message: "Invalid payment method" });
    }

    const items = [];
    let totalAmount = 0;

    for (const item of cartItems) {
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        return res.status(400).json({
          success: false,
          message: `Invalid product ID: ${item.productId}`,
        });
      }

      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`,
        });
      }

      const requestedQty = Number(item.quantity);
      const currentStock = Number(product.stock);

      if (currentStock < requestedQty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for: ${product.name} (Only ${currentStock} left)`
        });
      }

      items.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: requestedQty,
        image: product.image || "/placeholder.png",
      });

      totalAmount += product.price * requestedQty;

      console.log(`[DEBUG] Processing item: ${product.name}, Stock Before: ${currentStock}, Qty: ${requestedQty}`);

      // Decrease stock
      product.stock = Math.max(0, currentStock - requestedQty);
      await product.save();

      console.log(`[DEBUG] Stock After: ${product.stock}`);
    }

    const order = await Order.create({
      user: userId,
      items,
      shippingAddress,
      totalAmount,
      paymentMethod: "COD",
      paymentStatus: "Pending",
      orderStatus: "Placed",
    });

    return res.status(201).json({ success: true, order });
  } catch (err) {
    console.error("Place COD order error:", err);
    return res.status(500).json({ success: false, message: "Failed to place order" });
  }
};

// =======================
// GET USER ORDERS
// =======================
exports.getOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ user: userId })
      .populate("items.product", "name price image")
      .sort({ createdAt: -1 });

    return res.json({ success: true, orders });
  } catch (err) {
    console.error("Get orders error:", err);
    return res.status(500).json({ success: false, message: "Unable to load orders" });
  }
};
