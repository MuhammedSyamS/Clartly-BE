const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getCart,
  addToCart,
  removeFromCart,
} = require("../controllers/cartController");

// GET /api/cart
router.get("/", authMiddleware, getCart);

// POST /api/cart
router.post("/", authMiddleware, addToCart);

// DELETE /api/cart/:productId
router.delete("/:productId", authMiddleware, removeFromCart);

module.exports = router;
