const supabase = require("../config/supabaseClient");
const authenticateJWT = require("../middlewares/authMiddleware");
const express = require("express");
const router = express.Router();
const {
  setGeofence,
  getGeofences,
} = require("../controller/geoLocationController");

router.post("/set-geofence", setGeofence);

router.get("/geo_fence", getGeofences);

module.exports = router;
