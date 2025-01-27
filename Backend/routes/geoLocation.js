const supabase = require("../config/supabaseClient");
const authenticateJWT = require("../middlewares/authMiddleware");
const express = require("express");
const router = express.Router();
const {
  setGeofence,
  getOffices,
} = require("../controller/geoLocationController");

router.post("/set-geofence", authenticateJWT, setGeofence);

router.get("/offices", authenticateJWT, getOffices);

module.exports = router;
