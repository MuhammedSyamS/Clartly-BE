console.log("SERVER STARTED");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load env variables FIRST
dotenv.config();

// Import routes
const authRoutes = require("./src/routes/authRoutes");

const app = express();


// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });

// Start server
const PORT = process.env.PORT || 5000;
app.post("/test", (req, res) => {
  res.json({ message: "POST working" });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
