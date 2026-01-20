// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { placeOrder, trackOrder, getMyOrders } = require("../controllers/orderController");

router.post("/place", authMiddleware, placeOrder);
router.get("/", authMiddleware, getMyOrders); // 👈 must be "/" to match frontend
router.get("/:orderId", authMiddleware, trackOrder);

module.exports = router;
