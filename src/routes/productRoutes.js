const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET all products
router.get("/", async (req, res, next) => {
  try {
    const products = await Product.find(); // fetch all products
    res.json(products);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
