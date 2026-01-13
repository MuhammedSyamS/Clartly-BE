const express = require("express");
const cors = require("cors");       // <-- import cors
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./src/routes/authRoutes");

const app = express();

app.post("/test", (req, res) => {
  console.log("TEST BODY:", req.body);
  res.json({ body: req.body });
});


// ENABLE CORS
app.use(cors({
  origin: "http://localhost:5173", // your React app origin
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/routes", authRoutes);

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
