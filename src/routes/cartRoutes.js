const express = require("express");
const router = express.Router();
const { getCart, addToCart, removeFromCart, clearCart } = require("../controllers/cartController");
const protect = require("../middleware/authMiddleware");

// All routes require auth
router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.delete("/:productId", protect, removeFromCart);
router.post("/clear", protect, clearCart);

module.exports = router;
