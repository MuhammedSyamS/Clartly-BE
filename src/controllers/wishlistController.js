const User = require("../models/User");
const Product = require("../models/Product");

// ---------------------------------------------------------
// 1. YOUR EXISTING TOGGLE LOGIC (DO NOT CHANGE)
// ---------------------------------------------------------
exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: "Product ID is required" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.wishlist.findIndex(id => id.toString() === productId);

    if (index > -1) {
      user.wishlist.splice(index, 1);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    await user.populate("wishlist");
    res.status(200).json({ wishlist: user.wishlist });
  } catch (err) {
    console.error("Wishlist toggle error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------------------------------------
// 2. GET WISHLIST (DO NOT CHANGE)
// ---------------------------------------------------------
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ wishlist: user.wishlist });
  } catch (err) {
    console.error("Get wishlist error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------------------------------------
// ✅ 3. DELETE FUNCTION (This is what fixes the Trash button)
// ---------------------------------------------------------
exports.removeWishlistItem = async (req, res) => {
  try {
    const { productId } = req.params; // Get ID from URL
    console.log(`🗑️ Backend received delete request for ID: ${productId}`); // <--- DEBUG LOG

    const userId = req.user._id;

    // Use MongoDB $pull to FORCE remove the item
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: productId } },
      { new: true }
    ).populate("wishlist");

    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("✅ Item deleted successfully.");
    res.status(200).json({ wishlist: user.wishlist });

  } catch (err) {
    console.error("❌ Remove error:", err);
    res.status(500).json({ message: "Server error" });
  }
};