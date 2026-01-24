const express = require("express");
const router = express.Router();
const protect = require("../../middleware/authMiddleware");
const { isAdmin } = require("../../middleware/authMiddleware");
const {
  getDashboardStats,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllUsers,
  deleteUser,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require("../../controllers/admin/adminController");

// Dashboard
router.get("/stats", protect, isAdmin, getDashboardStats);

// Products
router.get("/products", protect, isAdmin, getAllProducts);
router.get("/products/:id", protect, isAdmin, getProductById);
router.post("/products", protect, isAdmin, createProduct);
router.put("/products/:id", protect, isAdmin, updateProduct);
router.delete("/products/:id", protect, isAdmin, deleteProduct);

// Users
router.get("/users", protect, isAdmin, getAllUsers);
router.delete("/users/:id", protect, isAdmin, deleteUser);

// Orders
router.get("/orders", protect, isAdmin, getAllOrders);
router.get("/orders/:id", protect, isAdmin, getOrderById);
router.put("/orders/:id/status", protect, isAdmin, updateOrderStatus);

module.exports = router;
