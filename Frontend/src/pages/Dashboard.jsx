import React, { useEffect } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the token exists
    const authToken = Cookies.get("token"); // Get the token from cookies
    if (!authToken) {
      navigate("/"); // Redirect to the login page if token is missing
    }
  }, [navigate]);

  const navi = () => {
    navigate("/setfence"); // Navigate to the Add Geofence page
  };

  return (
    <>
      <NavBar />
      <button
        onClick={navi}
        className="w-50 m-5 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition cursor-pointer"
      >
        Add geofence
      </button>
    </>
  );
};

export default Dashboard;
