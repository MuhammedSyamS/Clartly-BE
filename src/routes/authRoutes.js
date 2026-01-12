console.log("AUTH ROUTES FILE LOADED");

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/test", (req, res) => {
  res.json({ ok: true });
});
router.post("/ping", (req, res) => {
  res.json({ message: "AUTH ROUTE HIT" });
});

module.exports = router;
