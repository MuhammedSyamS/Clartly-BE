const express = require("express");
const router = express.Router();
const { isAdmin, protect } = require("../middleware/authMiddleware");
const {
  getDashboardStats,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllUsers,
  getAllOrders,
} = require("../controllers/adminController");

// Dashboard
router.get("/stats", protect, isAdmin, getDashboardStats);

// Products
router.get("/products", protect, isAdmin, getAllProducts);
router.post("/products", protect, isAdmin, createProduct);
router.put("/products/:id", protect, isAdmin, updateProduct);
router.delete("/products/:id", protect, isAdmin, deleteProduct);

// Users
router.get("/users", protect, isAdmin, getAllUsers);

// Orders
router.get("/orders", protect, isAdmin, getAllOrders);

module.exports = router;
