const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { placeOrder, getOrders } = require("../controllers/orderController");

// Place order (COD)
router.post("/place", protect, placeOrder);

// Get user orders
router.get("/", protect, getOrders);

// Optional: keep /my-orders if frontend expects it
router.get("/my-orders", protect, getOrders);

module.exports = router;
