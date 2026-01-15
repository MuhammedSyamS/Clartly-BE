const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, wishlistController.getWishlist);
router.post("/toggle/:productId", authMiddleware, wishlistController.toggleWishlist);

module.exports = router;
