// src/routes/middlewareRoute.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

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
router.get("/profile", auth(), getProfile);

// Admin-only route - requires login + admin
router.get("/admin/users", auth(true), getAllUsers);

module.exports = router;
