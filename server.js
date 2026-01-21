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

const errorMiddleware = require("./src/middleware/errorMiddleware");

const app = express();

// CORS - must include your frontend origin
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://verda-foregone-noncruciformly.ngrok-free.dev"
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/payment", paymentRoutes);

// Error handler
app.use(errorMiddleware);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ DB Connection Error:", err);
    process.exit(1);
  });

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
