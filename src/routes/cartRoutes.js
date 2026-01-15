const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");
const authMiddleware = require("../middleware.js/authMiddleware");

// GET user cart
router.get("/", authMiddleware, cartController.getCart);

// ADD item to cart
router.post("/add", authMiddleware, cartController.addToCart);

// REMOVE item from cart
router.post("/remove", authMiddleware, cartController.removeFromCart);

// CLEAR cart
router.post("/clear", authMiddleware, cartController.clearCart);

module.exports = router;
