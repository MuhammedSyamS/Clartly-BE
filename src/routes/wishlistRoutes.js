const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { toggleWishlist } = require("../controllers/wishlistController");

router.post("/", authMiddleware, toggleWishlist);

module.exports = router;
