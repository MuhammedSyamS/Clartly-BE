const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  placeOrder,
  getOrders,
} = require("../controllers/orderController");

// ✅ GET orders
router.get("/", authMiddleware, getOrders);

// ✅ PLACE order
router.post("/", authMiddleware, placeOrder);

module.exports = router;
