require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../src/models/User");
const Cart = require("../src/models/Cart");
const bcrypt = require("bcryptjs");

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // 1. Admin
    const adminExists = await User.findOne({ email: "admin@cartly.com" });
    if (!adminExists) {
      const admin = await User.create({
        name: "Admin User",
        email: "admin@cartly.com",
        password: "admin123",
        role: "admin"
      });
      // Cart
      const adminCart = await Cart.create({ user: admin._id, items: [] });
      admin.cart = adminCart._id;
      await admin.save();
      console.log("✅ Admin user created:", admin.email);
    } else {
      console.log("✅ Admin user already exists");
    }

    // 2. User
    const userExists = await User.findOne({ email: "user@cartly.com" });
    if (!userExists) {
      const user = await User.create({
        name: "Test User",
        email: "user@cartly.com",
        password: "user123",
        role: "user"
      });
      // Cart
      const userCart = await Cart.create({ user: user._id, items: [] });
      user.cart = userCart._id;
      await user.save();
      console.log("✅ Test user created:", user.email);
    } else {
      console.log("✅ Test user already exists");
    }

    console.log("\n🌱 Seed completed!");
    console.log("\nTest Credentials:");
    console.log("Admin - Email: admin@cartly.com, Password: admin123");
    console.log("User  - Email: user@cartly.com, Password: user123");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed Error:", err);
    process.exit(1);
  }
};

seedUsers();
