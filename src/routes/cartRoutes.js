const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

// DEBUG SAFETY CHECK (TEMPORARY)
console.log("authMiddleware:", typeof authMiddleware);
console.log("getCart:", typeof cartController.getCart);

// GET cart
router.get("/", authMiddleware, cartController.getCart);

// ADD to cart
router.post("/add", authMiddleware, cartController.addToCart);

// REMOVE from cart
router.delete("/:productId", authMiddleware, cartController.removeFromCart);

module.exports = router;
