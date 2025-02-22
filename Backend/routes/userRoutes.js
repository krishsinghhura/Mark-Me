const express = require("express");
const { signup, signin } = require("../controller/userController");
const authenticateJWT = require("../middlewares/authMiddleware");
const router = express.Router();

// User Signup
router.post("/signup", signup);

// User Login
router.post("/login", signin);

// Protected Route
router.get("/secure", authenticateJWT, (req, res) => {
  res
    .status(200)
    .json({ message: "Access granted to secure route", user: req.user });
});

module.exports = router;
