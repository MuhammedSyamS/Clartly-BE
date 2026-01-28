require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./src/routes/authRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const productRoutes = require("./src/routes/productRoutes");
const wishlistRoutes = require("./src/routes/wishlistRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const chatRoutes = require("./src/routes/chatRoutes");
const adminRoutes = require("./src/routes/admin/adminRoutes");
const middlewareRoute = require("./src/routes/middlewareRoutes");

const errorMiddleware = require("./src/middleware/errorMiddleware");

const app = express();

/* -------------------- MIDDLEWARE (ORDER MATTERS) -------------------- */

// 🔴 MUST come BEFORE routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔴 CORS must be BEFORE routes
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://verda-foregone-noncruciformly.ngrok-free.dev",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* -------------------- ROUTES -------------------- */

// Auth routes (no prefix by design)
app.use("/", authRoutes);

// API routes
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", middlewareRoute);

/* -------------------- ERROR HANDLER -------------------- */

// MUST be last
app.use(errorMiddleware);

/* -------------------- DATABASE -------------------- */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });

/* -------------------- SERVER -------------------- */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
