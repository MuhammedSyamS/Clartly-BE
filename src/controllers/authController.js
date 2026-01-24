const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Cart = require("../models/Cart");
const Otp = require("../models/Otp");
const sendOtp = require("../utils/sendOtp"); // nodemailer utility

// Generate JWT token
const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

// Sanitize user before sending to frontend
const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  cart: user.cart,
  wishlist: user.wishlist || [],
});

// Generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

// ===== OTP Signup =====
exports.requestOtp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists)
      return res.status(409).json({ message: "Email already registered" });

    const otp = generateOtp();

    // Save OTP + user info temporarily
    await Otp.findOneAndUpdate(
      { email: email.toLowerCase() },
      { name, password, otp, expiresAt: Date.now() + 5 * 60 * 1000 },
      { upsert: true, new: true }
    );

    await sendOtp(email, otp);

    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("REQUEST OTP ERROR:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = await Otp.findOne({ email: email.toLowerCase() });
    if (!record) return res.status(400).json({ message: "No OTP request found" });
    if (record.expiresAt < Date.now()) return res.status(400).json({ message: "OTP expired" });
    if (record.otp != otp) return res.status(400).json({ message: "Invalid OTP" });

    // Create user (password will hash automatically via pre-save hook)
    const role = email.toLowerCase().includes("admin") ? "admin" : "user";
    const user = await User.create({
      name: record.name,
      email: email.toLowerCase(),
      password: record.password,
      role,
    });

    // Create cart
    try {
      const cart = await Cart.create({ user: user._id, items: [] });
      user.cart = cart._id;
      await user.save();
    } catch (err) {
      console.error("Cart creation error:", err);
    }

    // Populate wishlist (fresh signup, so it's empty but properly referenced)
    await user.populate("wishlist");

    // Delete OTP record
    await Otp.deleteOne({ email: email.toLowerCase() });

    res.status(201).json({
      token: generateToken(user._id, user.role),
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};

// ===== LOGIN =====
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Ensure cart exists
    if (!user.cart) {
      try {
        const cart = await Cart.create({ user: user._id, items: [] });
        user.cart = cart._id;
        await user.save();
      } catch (err) {
        console.error("Cart creation error:", err);
      }
    }

    // Populate wishlist
    await user.populate("wishlist");

    res.status(200).json({
      token: generateToken(user._id, user.role),
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
