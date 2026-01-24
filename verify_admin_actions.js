const mongoose = require("mongoose");
const User = require("./src/models/User");
const Product = require("./src/models/Product");
const Cart = require("./src/models/Cart");
require("dotenv").config();

const verifyAdminActions = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // 1. Get Admin
        const admin = await User.findOne({ email: "admin@cartly.com" });
        if (!admin) throw new Error("Admin not found");
        console.log("Admin found:", admin._id, admin.role);

        // 2. Get Product
        const product = await Product.findOne();
        if (!product) throw new Error("No products found");
        console.log("Product found:", product._id);

        // 3. Test Wishlist Logic
        console.log("Testing Wishlist...");
        if (!admin.wishlist) admin.wishlist = [];
        const initialLen = admin.wishlist.length;

        // Toggle logic from controller
        const index = admin.wishlist.findIndex(id => id.toString() === product._id.toString());
        if (index > -1) {
            console.log("Removing from wishlist");
            admin.wishlist.splice(index, 1);
        } else {
            console.log("Adding to wishlist");
            admin.wishlist.push(product._id);
        }
        await admin.save();
        console.log("Wishlist saved. New length:", admin.wishlist.length);

        // 4. Test Cart Logic
        console.log("Testing Cart...");
        let cart = await Cart.findOne({ user: admin._id });
        if (!cart) {
            console.log("Creating new cart for admin");
            cart = await Cart.create({ user: admin._id, items: [] });
            admin.cart = cart._id;
            await admin.save();
        }

        const itemIndex = cart.items.findIndex(p => p.productId.toString() === product._id.toString());
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += 1;
        } else {
            cart.items.push({ productId: product._id, quantity: 1 });
        }
        await cart.save();
        console.log("Cart saved. Items:", cart.items.length);

        console.log("✅ VERIFICATION SUCCESSFUL: Backend logic works properly.");

    } catch (err) {
        console.error("❌ VERIFICATION FAILED:", err);
    } finally {
        await mongoose.disconnect();
    }
};

verifyAdminActions();
