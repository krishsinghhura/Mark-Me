const supabase = require("../config/supabaseClient");
const jwt = require("jsonwebtoken");

const setGeofence = async (req, res) => {
  const { latitude, longitude, radius, officeName } = req.body;

  // Validate required fields
  if (!latitude || !longitude || !radius || !officeName) {
    return res.status(400).json({
      error: "Latitude, longitude, radius, and office name are required.",
    });
  }

  try {
    // Save the geofence details to the database
    const { data, error } = await supabase
      .from("geo_fence")
      .insert([{ latitude, longitude, radius, office_name: officeName }]);

    // Handle potential errors from Supabase
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Geofence successfully set.",
      geofence: { latitude, longitude, radius, officeName },
    });
  } catch (err) {
    console.error("Server error:", err); // Log the actual error
    return res.status(500).json({ error: "Server error." });
  }
};

const getOffices = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("geo_fence") // Table name
      .select("office_name"); // Column to select

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json(data); // Return the data
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  setGeofence,
  getOffices,
};
