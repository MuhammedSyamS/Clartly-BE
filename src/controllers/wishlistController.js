const User = require("../models/User");

// GET WISHLIST
exports.getWishlist = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.user._id).populate("wishlist");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ wishlist: user.wishlist });
  } catch (err) {
    console.error("Get wishlist error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// TOGGLE WISHLIST ITEM
exports.toggleWishlist = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const productId = req.params.productId;
    const index = user.wishlist.indexOf(productId);

    if (index === -1) user.wishlist.push(productId); // add
    else user.wishlist.splice(index, 1); // remove

    await user.save();
    res.status(200).json({ wishlist: user.wishlist });
  } catch (err) {
    console.error("Toggle wishlist error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
