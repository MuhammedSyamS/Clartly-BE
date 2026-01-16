const User = require("../models/User");
const Product = require("../models/Product");

// -------------------------------
// TOGGLE WISHLIST
// -------------------------------
exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if product already in wishlist
    const index = user.wishlist.findIndex(id => id.toString() === productId);
    if (index > -1) {
      // Remove from wishlist
      user.wishlist.splice(index, 1);
    } else {
      // Add to wishlist
      user.wishlist.push(productId);
    }

    // Save changes
    await user.save();

    // Populate wishlist with full product objects
    await user.populate("wishlist");

    // Return updated wishlist
    res.json({ wishlist: user.wishlist });
  } catch (err) {
    console.error("Wishlist toggle error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------------
// GET FULL WISHLIST
// -------------------------------
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ wishlist: user.wishlist });
  } catch (err) {
    console.error("Get wishlist error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
