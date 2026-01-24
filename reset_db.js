const mongoose = require("mongoose");
const User = require("./src/models/User");
const Cart = require("./src/models/Cart");
require("dotenv").config();

const resetDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        await User.deleteMany({});
        console.log("✅ Cleared Users");

        await Cart.deleteMany({});
        console.log("✅ Cleared Carts");

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await mongoose.disconnect();
    }
};

resetDB();
