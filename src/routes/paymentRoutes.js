const protect = require("../middleware/authMiddleware");
const router = require("express").Router();
const controller = require("../controllers/paymentController");

router.post("/cod", protect, controller.placeCodOrder);
router.post("/razorpay", protect, controller.createRazorpayOrder);
router.post("/razorpay/verify", protect, controller.verifyRazorpay);

module.exports = router;
