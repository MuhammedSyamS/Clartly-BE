const User = require("../models/User");

// TOGGLE WISHLIST
exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    const index = user.wishlist.findIndex(id => id.toString() === productId);
    if (index > -1) {
      user.wishlist.splice(index, 1);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (err) {
    console.error("Wishlist error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
