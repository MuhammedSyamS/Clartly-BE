const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// ROUTES
const authRoutes = require("./src/routes/authRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const productRoutes = require("./src/routes/productRoutes");
const wishlistRoutes = require("./src/routes/wishlistRoutes");

// MIDDLEWARE
const errorMiddleware = require("./src/middleware/errorMiddleware");
// const authMiddleware = require("./src/middleware/authMiddleware"); // Not used globally, used in routes

const app = express();

// GLOBAL MIDDLEWARE
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"], // Allow your frontend ports
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("API running");
});

// ✅ REGISTER ROUTES
app.use("/", authRoutes);
app.use("/api/cart", cartRoutes);

// ⚠️ FIXED: Changed from "/api/orders" to "/api/order" to match Frontend
app.use("/api/order", orderRoutes); 

app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);

// ERROR HANDLER
app.use(errorMiddleware);

// DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ DB Connection Error:", err);
    process.exit(1);
  });

// SERVER START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));