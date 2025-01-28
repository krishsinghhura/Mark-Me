import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie

const Dashboard = () => {
  const navigate = useNavigate();
  const [officeLocation, setOfficeLocation] = useState(null); // State for selected office location
  const [distance, setDistance] = useState(null); // Distance from geofence
  const [status, setStatus] = useState(""); // Status: Inside/Outside geofence
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    const authToken = Cookies.get("token"); // Get the token from cookies

    if (!authToken) {
      navigate("/"); // Redirect to the login page if token is missing
    } else {
      // Fetch office geofence data
      axios
        .get("http://localhost:4000/employee/geo-fence", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          const selectedOfficeData = response.data; // Get the geofence data from the response

          if (selectedOfficeData) {
            console.log(
              "Selected Office Latitude: ",
              selectedOfficeData.latitude
            );
            console.log(
              "Selected Office Longitude: ",
              selectedOfficeData.longitude
            );
            console.log("Selected Office Radius: ", selectedOfficeData.radius);

            setOfficeLocation({
              latitude: selectedOfficeData.latitude,
              longitude: selectedOfficeData.longitude,
              radius: selectedOfficeData.radius, // Geofence radius in meters
            });
          } else {
            console.error("Geofence data not found.");
          }
        })
        .catch((error) => {
          console.error("Error fetching geofence data:", error);
        });
    }
  }, [navigate]);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(
            "Current Location: Latitude -",
            latitude,
            "Longitude -",
            longitude
          ); // Log current location

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

  const navi = () => {
    navigate("/face-detect");
  };

  const navi2 = () => {
    navigate("/face-recognize");
  };

  return (
    <>
      <NavBar />
      <div className="m-5">
        <h1 className="text-lg font-bold mb-3">Office Geofence</h1>
        <button
          onClick={getLocation}
          className="w-50 m-5 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition cursor-pointer"
        >
          Get Location
        </button>

        <button
          onClick={navi}
          className="w-50 m-5 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition cursor-pointer"
        >
          Add face Authentication
        </button>

        <button
          onClick={navi2}
          className="w-50 m-5 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition cursor-pointer"
        >
          Authenticate your face
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
