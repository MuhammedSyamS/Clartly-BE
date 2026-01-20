const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Cart = require("../models/Cart");

// 1. Generate Token (Includes Role)
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// 2. Sanitize User (Sends Role to Frontend)
const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role, 
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

    // ✅ DEVELOPER TRICK: Auto-assign Admin role if email contains 'admin'
    // Example: "john@admin.com" -> Becomes Admin
    // Example: "john@gmail.com" -> Becomes User
    const role = email.toLowerCase().includes("admin") ? "admin" : "user";

    // 3. Create User
    const user = await User.create({ name, email, password, role });

    // 4. Create Cart
    const cart = await Cart.create({ user: user._id, items: [] });
    user.cart = cart._id;
    await user.save();

    console.log(`🆕 New User: ${email} (Role: ${role})`);

    res.status(201).json({
      token: generateToken(user._id, user.role),
      user: sanitizeUser(user),
    });

  } catch (err) {
    console.error("SIGNUP ERROR:", err); 
    res.status(500).json({ message: err.message });
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

    // Fix: Ensure cart exists (for old users)
    if (!user.cart) {
      const cart = await Cart.create({ user: user._id, items: [] });
      user.cart = cart._id;
      await user.save();
    }

    console.log(`🔓 Login Success: ${email} (Role: ${user.role})`);

    res.status(200).json({
      token: generateToken(user._id, user.role),
      user: sanitizeUser(user),
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};