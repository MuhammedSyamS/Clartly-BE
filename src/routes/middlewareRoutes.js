// src/routes/middlewareRoute.js
const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/authMiddleware");

// Dummy controllers (replace with your real controllers)
const getProfile = (req, res) => {
  res.json({ message: "User profile data", user: req.user });
};

const getAllUsers = (req, res) => {
  res.json({ message: "All users for admin", userCount: 42 });
};

// ============================
// Routes using middleware
// ============================

// Normal user route - requires login
router.get("/profile", protect, getProfile);

// Admin-only route - requires login + admin
router.get("/admin/users", protect, isAdmin, getAllUsers);

module.exports = router;
