import React, { useState } from "react";
import NavBar from "../components/NavBar";
import axios from "axios";
import Cookies from "js-cookie"; // Import the js-cookie library

const SetFence = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [radius, setRadius] = useState("");
  const [officeName, setOfficeName] = useState(""); // State for office name
  const [message, setMessage] = useState("");

  // Ask for location permission and fetch location
  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setMessage("Location fetched successfully!");
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setMessage("Permission denied. Please enable location access.");
          } else {
            setMessage("Failed to fetch location. Please try again.");
          }
          console.error(error);
        }
      );
    } else {
      setMessage("Geolocation is not supported by your browser.");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!latitude || !longitude || !radius || !officeName) {
      setMessage(
        "Please fetch location, enter radius, and provide office name."
      );
      return;
    }

    const geofenceData = {
      latitude,
      longitude,
      radius: parseInt(radius),
      officeName,
    };

    // Get the JWT token from cookies
    const token = Cookies.get("token"); // Replace with the actual cookie name

    if (!token) {
      setMessage("No token found. Please login.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/employer/set-geofence",
        geofenceData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Geofence set successfully!");
      console.log(response.data);
    } catch (error) {
      setMessage("Failed to set geofence.");
      console.error(error);
    }
  };

  return (
    <>
      <NavBar />
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Geofence Dashboard
        </h1>

        <button
          onClick={fetchLocation}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Fetch Location
        </button>

        {latitude && longitude && (
          <p className="mt-4 text-gray-700 text-center">
            <strong>Latitude:</strong> {latitude.toFixed(6)},{" "}
            <strong>Longitude:</strong> {longitude.toFixed(6)}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6">
          <label className="block text-gray-700 mb-2 text-sm font-medium">
            Office Name:
          </label>
          <input
            type="text"
            value={officeName}
            onChange={(e) => setOfficeName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none mb-4"
            placeholder="Enter office name"
          />

          <label className="block text-gray-700 mb-2 text-sm font-medium">
            Enter Radius (in meters):
          </label>
          <input
            type="number"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none mb-4"
            placeholder="Enter radius"
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
          >
            Set Geofence
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm font-medium text-gray-800">
            {message}
          </p>
        )}
      </div>
    </>
  );
};

export default SetFence;
