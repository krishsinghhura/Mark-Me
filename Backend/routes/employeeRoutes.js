const express = require("express");
const {
  signup,
  signin,
  updateOfficeName,
} = require("../controller/employeeController");
const authenticateJWT = require("../middlewares/authMiddleware");
const router = express.Router();

// User Signup
router.post("/signup", signup);

// User Login
router.post("/login", signin);

router.put("/update-office", authenticateJWT, updateOfficeName);

// Protected Route
router.get("/secure", authenticateJWT, (req, res) => {
  res
    .status(200)
    .json({ message: "Access granted to secure route", user: req.user });
});

module.exports = router;
