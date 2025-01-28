import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as faceapi from "face-api.js";
import { createClient } from "@supabase/supabase-js";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie"; // Make sure to install this library: npm install js-cookie

// Initialize Supabase client
const supabaseUrl = "https://bemuwkmjydllrijcgtde.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlbXV3a21qeWRsbHJpamNndGRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0NTQ4MjEsImV4cCI6MjA1MzAzMDgyMX0.0VDj1RJlYkfw8D33ci61dCqp5lV78xuYNYGkp72QTlo";
const supabase = createClient(supabaseUrl, supabaseKey);

const MODEL_URL = "/models";

const FaceDetection = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [faceLandmarkStatus, setFaceLandmarkStatus] = useState(null); // Track the status

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        setLoading(false);
      } catch (error) {
        console.error("Error loading models:", error);
        setError("Failed to load face detection models");
      }
    };

    loadModels();
    checkFaceLandmarkStatus(); // Check status before starting the camera
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Error accessing webcam:", error);
        setError("Failed to access webcam");
      });
  };

  const stopVideo = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const saveFaceLandmarksToSupabase = async (landmarks) => {
    try {
      // Retrieve the token from cookies
      const token = Cookies.get("token"); // Replace 'token' with your cookie key
      if (!token) {
        throw new Error("No token found in cookies");
      }

      // Decode the token to extract the email
      const decoded = jwtDecode(token);
      const email = decoded.email; // Assuming the token contains the email field

      if (!email) {
        throw new Error("Email not found in the decoded token");
      }

      console.log("Decoded email:", email);

      // Update the face_landmark in Supabase for the user with the decoded email
      const { data, error } = await supabase
        .from("employee")
        .update({ face_landmark: landmarks })
        .eq("email", email); // Match employee by email

      if (error) throw error;
      navigate("/face-recognize");
      return data;
    } catch (error) {
      console.error("Error saving to Supabase:", error);
      throw error;
    }
  };

  const detectFaceLandmarks = async () => {
    if (!videoRef.current) return;

    try {
      const detections = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceLandmarks();

      if (detections) {
        const landmarks = detections.landmarks.positions;
        console.log("Detected Face Landmarks:", landmarks);

        // Save to Supabase
        await saveFaceLandmarksToSupabase(landmarks);

        stopVideo();
      } else {
        setError("No face detected. Please try again.");
      }
    } catch (err) {
      console.error("Error during face detection:", err);
      setError("Failed to process face detection");
    }
  };

  const checkFaceLandmarkStatus = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("No token found in cookies");

      const decoded = jwtDecode(token);
      const email = decoded.email;

      const { data, error } = await supabase
        .from("employee")
        .select("face_landmark")
        .eq("email", email)
        .single(); // Get the single record for the user

      if (error) throw error;

      // Check if face_landmark is NULL
      if (data && data.face_landmark === null) {
        setFaceLandmarkStatus("proceed");
        startVideo(); // Open the camera only if face_landmark is NULL
      } else {
        setFaceLandmarkStatus("contact");
      }
    } catch (error) {
      console.error("Error fetching face landmark status:", error);
      setError("Failed to fetch face landmark status");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Face Landmark Extraction</h1>

      {loading ? (
        <p className="text-lg">Loading models...</p>
      ) : (
        <>
          {faceLandmarkStatus === "contact" ? (
            <p className="mt-2 text-red-500">
              Contact your employer to authorize it.
            </p>
          ) : faceLandmarkStatus === "proceed" ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                muted
                className="rounded-lg shadow-lg border-2 border-gray-600"
              />
              <button
                onClick={detectFaceLandmarks}
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Capture & Proceed
              </button>
            </>
          ) : null}
          {error && <p className="mt-2 text-red-500">{error}</p>}
        </>
      )}
    </div>
  );
};

export default FaceDetection;
