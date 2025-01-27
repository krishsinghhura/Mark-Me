import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [userId, setUserId] = useState(null);

  // useEffect(() => {
  //   // Retrieve and decode the JWT from cookies
  //   const token = Cookies.get("token"); // Use the cookie name you stored the JWT with
  //   if (token) {
  //     try {
  //       const decodedToken = jwtDecode(token);
  //       setUserId(decodedToken.userid);
  //     } catch (err) {
  //       console.error("Invalid token", err);
  //       setUserId(null);
  //     }
  //   }
  // }, []);

  return (
    <>
      <Routes>
        {/* Pass userId directly to CustomerPanel */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
