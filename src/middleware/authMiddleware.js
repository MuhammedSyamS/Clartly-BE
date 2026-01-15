// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // your User model

// Middleware function
const authMiddleware = async (req, res, next) => {
  try {
    // 1️⃣ Get token from header
    const authHeader = req.headers.authorization; // "Bearer <token>"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1]; // Extract token part

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Attach user to request object
    const user = await User.findById(decoded.id).select("-password"); // exclude password
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user; // Now controllers can access req.user
    next(); // move to next middleware/controller
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
