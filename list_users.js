const mongoose = require("mongoose");
const User = require("./src/models/User");
require("dotenv").config();

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB:", process.env.MONGO_URI); // Log URI to verify

        const users = await User.find({});
        console.log("Found", users.length, "users:");
        users.forEach(u => {
            console.log(`- ID: ${u._id}, Name: ${u.name}, Email: ${u.email}, Role: ${u.role}`);
        });

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await mongoose.disconnect();
    }
};

listUsers();
