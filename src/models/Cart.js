const mongoose = require("mongoose");

// Sub-schema for individual cart items
const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Reference to Product collection
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
}, { _id: false }); // Optional: don't generate _id for subdocuments

// Main Cart schema
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // One cart per user
  },
  items: [cartItemSchema], // Array of cart items
}, { timestamps: true }); // Keeps track of createdAt and updatedAt

module.exports = mongoose.model("Cart", cartSchema);
