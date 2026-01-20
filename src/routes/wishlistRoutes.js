const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// ✅ IMPORT ALL 3 FUNCTIONS
const {
  toggleWishlist,
  getWishlist,
  removeWishlistItem, 
} = require("../controllers/wishlistController");

// 1. Toggle
router.post("/toggle", authMiddleware, toggleWishlist);

// 2. Get All
router.get("/", authMiddleware, getWishlist);

// ✅ 3. DELETE ROUTE (Must match this exactly)
router.delete("/:productId", authMiddleware, removeWishlistItem);

module.exports = router;