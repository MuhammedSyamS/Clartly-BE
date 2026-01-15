const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");
const authMiddleware = require("../middleware/authMiddleware")

// GET wishlist
router.get("/", authMiddleware, wishlistController.getWishlist);

// TOGGLE product
router.post("/toggle/:productId", authMiddleware, wishlistController.toggleWishlist);

module.exports = router;
