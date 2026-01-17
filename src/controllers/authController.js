const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Cart = require("../models/Cart");

// Generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// Sanitize user object to send to frontend
const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role || "user",
  cart: user.cart,
  wishlist: user.wishlist || [],
});

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ message: "Email already registered" });

    // Create user (password hashed automatically by pre-save hook)
    const user = await User.create({ name, email, password });

    // Create empty cart for new user
    const cart = await Cart.create({ user: user._id, items: [] });
    user.cart = cart._id;
    await user.save();

    // Return token + user
    res.status(201).json({
      token: generateToken(user._id),
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Ensure cart exists (important if DB was empty)
    if (!user.cart) {
      const cart = await Cart.create({ user: user._id, items: [] });
      user.cart = cart._id;
      await user.save();
    }

    res.status(200).json({
      token: generateToken(user._id),
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
