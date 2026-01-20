const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// PLACE ORDER
exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product)
        return res
          .status(404)
          .json({ message: `Product not found: ${item.productId}` });

      orderItems.push({
        product: product._id,
        name: product.name,   // snapshot
        image: product.image, // snapshot
        quantity: item.quantity,
        price: product.price,
      });

      totalAmount += product.price * item.quantity;
    }

    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "Pending" : "Paid",
      status: "Pending",
    });

    await Cart.deleteOne({ user: userId });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error("Place Order Error:", err);
    res.status(500).json({ message: "Failed to place order" });
  }
};

// GET MY ORDERS
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    console.error("Get Orders Error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// TRACK ORDER
exports.trackOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user._id,
    });

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error("Track Order Error:", err);
    res.status(500).json({ message: "Failed to track order" });
  }
};
