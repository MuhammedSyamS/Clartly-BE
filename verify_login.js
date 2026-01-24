const mongoose = require("mongoose");
const User = require("./src/models/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const verifyLogin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const email = "admin@cartly.com";
        const password = "admin123";

        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ User not found:", email);
            return;
        }

        console.log("User found:", user._id);
        console.log("Stored Hash:", user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            console.log("✅ Credentials are VALID. Login should work.");
        } else {
            console.log("❌ Credentials INVALID. Password mismatch.");

            // Debug: Check if double hashing happened?
            // Try comparing with hash of "admin123" just in case
            // or simply re-save the user to trigger the hook again properly?
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await mongoose.disconnect();
    }
};

verifyLogin();
