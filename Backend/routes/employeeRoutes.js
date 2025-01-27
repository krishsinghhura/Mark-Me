const express = require("express");
const {
  signup,
  signin,
  updateOfficeName,
} = require("../controller/employeeController");
const authenticateJWT = require("../middlewares/authMiddleware");
const { getGeoFenceDetails } = require("../controller/employeeController");
const router = express.Router();

// User Signup
router.post("/signup", signup);

// User Login
router.post("/login", signin);

router.put("/update-office", authenticateJWT, updateOfficeName);

router.get("/geo-fence", authenticateJWT, getGeoFenceDetails);

module.exports = router;
