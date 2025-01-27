import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie

const Dashboard = () => {
  const navigate = useNavigate();
  const [officeNames, setOfficeNames] = useState([]); // State to store the list of office names
  const [selectedOffice, setSelectedOffice] = useState(""); // State for selected office name
  const [officeLocation, setOfficeLocation] = useState(null); // State for selected office location
  const [distance, setDistance] = useState(null); // Distance from geofence
  const [status, setStatus] = useState(""); // Status: Inside/Outside geofence

  useEffect(() => {
    const authToken = Cookies.get("token"); // Get the token from cookies

    if (!authToken) {
      navigate("/"); // Redirect to the login page if token is missing
    } else {
      // Fetch office names and their geofence locations
      axios
        .get("http://localhost:4000/employer/offices", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          setOfficeNames(response.data); // Set the office names and locations
        })
        .catch((error) => {
          console.error("Error fetching office names:", error);
        });
    }
  }, [navigate]);

  const handleOfficeSelection = async () => {
    if (selectedOffice) {
      try {
        const authToken = Cookies.get("token");

        await axios.put(
          "http://localhost:4000/employee/update-office", // Backend endpoint for updating office_name
          { office_name: selectedOffice },
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        const selectedOfficeData = officeNames.find(
          (office) => office.office_name === selectedOffice
        );

        setOfficeLocation({
          latitude: selectedOfficeData.latitude,
          longitude: selectedOfficeData.longitude,
          radius: selectedOfficeData.radius, // Geofence radius in meters
        });

        alert("Office name updated successfully!");
      } catch (error) {
        console.error("Error updating office name:", error);
        alert("Failed to update office name. Please try again.");
      }
    } else {
      alert("Please select an office.");
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (officeLocation) {
            calculateDistance(latitude, longitude);
          } else {
            console.error("No office location selected.");
          }
        },
        (error) => {
          console.error("Error fetching location:", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const calculateDistance = (userLat, userLng) => {
    const toRadians = (degrees) => (degrees * Math.PI) / 180;

    const R = 6371000; // Earth's radius in meters
    const dLat = toRadians(officeLocation.latitude - userLat);
    const dLng = toRadians(officeLocation.longitude - userLng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(userLat)) *
        Math.cos(toRadians(officeLocation.latitude)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in meters

    setDistance(distance);

    if (distance <= officeLocation.radius) {
      setStatus("Inside Geofence");
    } else {
      setStatus(
        `Outside Geofence by ${Math.round(
          distance - officeLocation.radius
        )} meters`
      );
    }
  };

  return (
    <>
      <NavBar />
      <div className="m-5">
        <h1 className="text-lg font-bold mb-3">Select Your Office</h1>
        <select
          value={selectedOffice}
          onChange={(e) => setSelectedOffice(e.target.value)}
          className="w-full py-2 px-4 mb-4 border rounded-lg"
        >
          <option value="" disabled>
            -- Select Office --
          </option>
          {officeNames.map((office, index) => (
            <option key={index} value={office.office_name}>
              {office.office_name}
            </option>
          ))}
        </select>
        <button
          onClick={handleOfficeSelection}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition cursor-pointer mb-5"
        >
          Save Office Name
        </button>
      </div>

      {status && (
        <div
          className={`m-5 p-4 text-center rounded-lg ${
            status.includes("Inside")
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {status}
        </div>
      )}

      <button
        onClick={getLocation}
        className="w-50 m-5 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition cursor-pointer"
      >
        Get Location
      </button>

      {distance !== null && (
        <p className="m-5 text-lg">
          You are currently <strong>{Math.round(distance)} meters</strong> away
          from the office.
        </p>
      )}
    </>
  );
};

export default Dashboard;
