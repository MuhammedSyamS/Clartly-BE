const mongoose = require("mongoose");
const User = require("./src/models/User");
const Cart = require("./src/models/Cart");
require("dotenv").config();

const checkUserCart = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const email = "user@cartly.com";
        const user = await User.findOne({ email });

        if (!user) {
            console.log("❌ User not found:", email);
            return;
        }
        console.log("✅ User found:", user._id);

        const cart = await Cart.findOne({ user: user._id });

        if (!cart) {
            console.log("❌ Cart NOT FOUND for user!");
            // Attempt to fix
            const newCart = await Cart.create({ user: user._id, items: [] });
            user.cart = newCart._id;
            await user.save();
            console.log("🛠️ Fixed: Created new empty cart for user.");
        } else {
            console.log("✅ Cart found:", cart._id);
            console.log("Cart Items:", JSON.stringify(cart.items, null, 2));
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await mongoose.disconnect();
    }
};

checkUserCart();
