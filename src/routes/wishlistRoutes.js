// src/routes/wishlistRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getWishlist, toggleWishlist, removeWishlistItem } = require("../controllers/wishlistController");

router.get("/", auth(), getWishlist);
router.post("/toggle", auth(), toggleWishlist);
router.delete("/:productId", auth(), removeWishlistItem);

module.exports = router;
