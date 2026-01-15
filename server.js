
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





// MIDDLEWARE
const errorMiddleware = require("./src/middleware/errorMiddleware");

const app = express();

// ======================
// GLOBAL MIDDLEWARE
// ======================
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================
// ROUTES
// ======================
app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);



// ======================
// ERROR HANDLER
// ======================
app.use(errorMiddleware);

// ======================
// DATABASE
// ======================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

// ======================
// SERVER
// ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
