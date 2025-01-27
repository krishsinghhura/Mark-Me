import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie

const Dashboard = () => {
  const navigate = useNavigate();
  const [officeNames, setOfficeNames] = useState([]); // State to store the list of office names
  const [selectedOffice, setSelectedOffice] = useState(""); // State for selected office name

  useEffect(() => {
    // Check if the token exists
    const authToken = Cookies.get("token"); // Get the token from cookies
    if (!authToken) {
      navigate("/"); // Redirect to the login page if token is missing
    } else {
      // Fetch office names from the geo_fence table
      axios
        .get("http://localhost:4000/employer/geo_fence") // Replace with your backend endpoint for fetching office names
        .then((response) => {
          setOfficeNames(response.data); // Set the office names in state
        })
        .catch((error) => {
          console.error("Error fetching office names:", error);
        });
    }
  }, [navigate]);

  const handleOfficeSelection = async () => {
    if (selectedOffice) {
      try {
        // Update the employee's office_name in the employee table
        const authToken = Cookies.get("token");
        await axios.put(
          "http://localhost:4000/employee/update-office", // Replace with your backend endpoint for updating office_name
          {
            office_name: selectedOffice,
          },
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
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
          console.log("Latitude:", latitude);
          console.log("Longitude:", longitude);
        },
        (error) => {
          console.error("Error fetching location:", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
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
      <button
        onClick={getLocation}
        className="w-50 m-5 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition cursor-pointer"
      >
        Get Location
      </button>
    </>
  );
};

export default Dashboard;
