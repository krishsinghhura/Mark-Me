import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/login";
import Dashboard from "./pages/Dashboard";
import FaceDetection from "./pages/FaceDetect";
import FaceRecognition from "./pages/FaceRecognize";

function App() {
  return (
    <>
      <Routes>
        {/* Pass userId directly to CustomerPanel */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/face-detect" element={<FaceDetection />} />
        <Route path="/face-recognize" element={<FaceRecognition />} />
      </Routes>
    </>
  );
}

export default App;
