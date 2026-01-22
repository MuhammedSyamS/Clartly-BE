const express = require("express");
const router = express.Router();
const { getCart, addToCart, removeFromCart, clearCart } = require("../controllers/cartController");
const auth = require("../middleware/authMiddleware");

// All routes require auth
router.get("/", auth(), getCart);
router.post("/add", auth(), addToCart);
router.delete("/:productId", auth(), removeFromCart);
router.post("/clear", auth(), clearCart);

module.exports = router;
