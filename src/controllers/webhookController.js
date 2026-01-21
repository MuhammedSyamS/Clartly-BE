const crypto = require("crypto");
const Order = require("../models/Order");

exports.razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const signature = req.headers["x-razorpay-signature"];

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(req.body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).json({ message: "Invalid webhook signature" });
    }

    const event = JSON.parse(req.body.toString());

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;

      await Order.findOneAndUpdate(
        { "razorpay.orderId": razorpayOrderId },
        {
          paymentStatus: "Paid",
          status: "Processing",
        }
      );
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook Error:", err);
    res.status(500).json({ message: "Webhook handling failed" });
  }
};
