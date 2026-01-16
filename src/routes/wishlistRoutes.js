const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  toggleWishlist,
  getWishlist, // ✅ import the new controller
} = require("../controllers/wishlistController");

// Toggle a product in wishlist
router.post("/toggle", authMiddleware, toggleWishlist);

// Get full wishlist for the logged-in user
router.get("/", authMiddleware, getWishlist);

module.exports = router;
