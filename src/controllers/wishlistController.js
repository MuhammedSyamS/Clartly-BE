const User = require("../models/User");

// GET wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.status(200).json({ wishlist: user.wishlist });
  } catch (err) {
    console.error("Get wishlist error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// TOGGLE product in wishlist
exports.toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
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
