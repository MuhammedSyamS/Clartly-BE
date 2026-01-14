// cartRoute.js
const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware"); // make sure you have this

// ======================
// All routes need authentication
// ======================

// GET /cart → get user’s cart
router.get("/", authMiddleware, cartController.getCart);

// POST /cart/add → add item to cart
router.post("/add", authMiddleware, cartController.addToCart);

// POST /cart/remove → remove item from cart
router.post("/remove", authMiddleware, cartController.removeFromCart);

// POST /cart/clear → clear entire cart
router.post("/clear", authMiddleware, cartController.clearCart);

module.exports = router;
