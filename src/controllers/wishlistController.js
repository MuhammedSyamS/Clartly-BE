const User = require("../models/User");
const Product = require("../models/Product");

exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    console.log("Toggle wishlist - User:", req.user?._id, "Product:", productId);
    
    if (!productId) return res.status(400).json({ message: "Product ID is required" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.wishlist) user.wishlist = [];
    
    const index = user.wishlist.findIndex(id => id.toString() === productId);
    if (index > -1) user.wishlist.splice(index, 1);
    else user.wishlist.push(productId);

    await user.save();
    const updatedUser = await User.findById(req.user._id).populate("wishlist");

    res.status(200).json({ wishlist: updatedUser.wishlist });
  } catch (err) {
    console.error("Wishlist toggle error:", err.message, err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

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

exports.removeWishlistItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { wishlist: productId } },
      { new: true }
    ).populate("wishlist");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ wishlist: user.wishlist });
  } catch (err) {
    console.error("Remove wishlist error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
