const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createRazorpayOrder,
  verifyPayment,
} = require("../controllers/paymentController");

router.post("/create-razorpay-order", authMiddleware, createRazorpayOrder);
router.post("/verify", authMiddleware, verifyPayment);

module.exports = router;
