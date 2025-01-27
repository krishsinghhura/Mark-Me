const supabase = require("../config/supabaseClient");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Sign up the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp(
      { email, password },
      { data: { email_confirm: true } }
    );

    if (authError) {
      console.error("Auth Error:", authError.message);
      throw authError;
    }

    // Insert user data into the "employee" table
    const { data: tableData, error: tableError } = await supabase
      .from("employee")
      .insert([{ email }]);

    if (tableError) {
      console.error("Table Insert Error:", tableError.message);
      throw tableError;
    }

    res.status(201).json({
      message: "Employee signed up successfully",
      authData,
      tableData,
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    res.status(200).json({
      message: "Login successful",
      token: data.session.access_token, // JWT Token
      user: data.user,
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

const updateOfficeName = async (req, res) => {
  const { office_name } = req.body; // Get office_name from request body

  if (!office_name) {
    return res.status(400).json({ message: "Office name is required" });
  }

  try {
    const email = req.user.email; // Use email from the decoded JWT

    // Update the employee's office name in the employee table
    const { data, error } = await supabase
      .from("employee")
      .update({ office_name: office_name }) // Set the office_name column
      .eq("email", email) // Use email to match the logged-in user
      .select();

    if (error) {
      throw error;
    }

    res.status(200).json({ message: "Office name updated successfully", data });
  } catch (error) {
    console.error("Error updating office name:", error);
    res.status(500).json({ message: "Failed to update office name", error });
  }
};

const getGeoFenceDetails = async (req, res) => {
  try {
    const email = req.user.email; // Use email from the decoded JWT

    // Step 2: Get the office_name of the employee from the employee table using email
    const { data: employeeData, error: employeeError } = await supabase
      .from("employee")
      .select("office_name")
      .eq("email", email)
      .single(); // assuming only one employee with this email

    if (employeeError || !employeeData) {
      return res.status(404).json({
        message: "Employee not found or error fetching employee data",
      });
    }

    const officeName = employeeData.office_name;

    // Step 3: Get the latitude, longitude, and radius from the geo_fence table using office_name
    const { data: geoFenceData, error: geoFenceError } = await supabase
      .from("geo_fence")
      .select("latitude, longitude, radius")
      .eq("office_name", officeName)
      .single(); // assuming only one geo_fence per office_name

    if (geoFenceError || !geoFenceData) {
      return res
        .status(404)
        .json({ message: "Geo-fence not found for the office" });
    }

    // Step 4: Return the latitude, longitude, and radius
    return res.status(200).json({
      latitude: geoFenceData.latitude,
      longitude: geoFenceData.longitude,
      radius: geoFenceData.radius,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  signup,
  signin,
  updateOfficeName,
  getGeoFenceDetails,
};
