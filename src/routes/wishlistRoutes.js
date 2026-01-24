// src/routes/wishlistRoutes.js
const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getWishlist, toggleWishlist, removeWishlistItem } = require("../controllers/wishlistController");

router.get("/", protect, getWishlist);
router.post("/toggle", protect, toggleWishlist);
router.delete("/:productId", protect, removeWishlistItem);

module.exports = router;
