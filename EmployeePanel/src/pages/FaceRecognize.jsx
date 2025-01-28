import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { createClient } from "@supabase/supabase-js";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode to decode the token
import Cookies from "js-cookie"; // Import js-cookie to get the token from cookies

const MODEL_URL = "/models";
const SIMILARITY_THRESHOLD = 0.7;
const supabaseUrl = "https://bemuwkmjydllrijcgtde.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlbXV3a21qeWRsbHJpamNndGRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0NTQ4MjEsImV4cCI6MjA1MzAzMDgyMX0.0VDj1RJlYkfw8D33ci61dCqp5lV78xuYNYGkp72QTlo";
const supabase = createClient(supabaseUrl, supabaseKey);

const FaceRecognition = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [match, setMatch] = useState(null);
  const [debug, setDebug] = useState("");
  const [email, setEmail] = useState(""); // State to store the email

  useEffect(() => {
    // Decode token to extract email
    const token = Cookies.get("token"); // Retrieve token from cookies
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const decodedEmail = decoded.email; // Assuming the token contains the 'email' field
        if (decodedEmail) {
          setEmail(decodedEmail); // Set the email in state
        } else {
          setDebug("Email not found in token");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setDebug("Error decoding token: " + error.message);
      }
    } else {
      setDebug("No token found in cookies");
    }

    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        setLoading(false);
      } catch (error) {
        console.error("Error loading models:", error);
        setDebug("Error loading models: " + error.message);
      }
    };

    loadModels();
    startVideo();
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
        setDebug("Error accessing webcam: " + error.message);
      });
  };

  const stopVideo = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const getCoordinates = (point) => {
    if (point._x !== undefined && point._y !== undefined) {
      return { x: point._x, y: point._y };
    }
    if (point.x !== undefined && point.y !== undefined) {
      return { x: point.x, y: point.y };
    }
    return null;
  };

  const calculateLandmarkSimilarity = (liveLandmarks, storedLandmarks) => {
    try {
      console.log("Calculating similarity...");

      if (!Array.isArray(liveLandmarks) || !Array.isArray(storedLandmarks)) {
        setDebug("Invalid landmark format");
        return 0;
      }

      if (liveLandmarks.length === 0 || storedLandmarks.length === 0) {
        setDebug("Empty landmarks array");
        return 0;
      }

      const numPoints = Math.min(liveLandmarks.length, storedLandmarks.length);

      const getCenterPoint = (landmarks) => {
        let sumX = 0,
          sumY = 0,
          validPoints = 0;

        landmarks.forEach((point) => {
          const coords = getCoordinates(point);
          if (coords) {
            sumX += coords.x;
            sumY += coords.y;
            validPoints++;
          }
        });

        return {
          x: sumX / validPoints,
          y: sumY / validPoints,
        };
      };

      const liveCenter = getCenterPoint(liveLandmarks);
      const storedCenter = getCenterPoint(storedLandmarks);

      let totalSimilarity = 0;
      let validComparisons = 0;

      for (let i = 0; i < numPoints; i++) {
        const liveCoords = getCoordinates(liveLandmarks[i]);
        const storedCoords = getCoordinates(storedLandmarks[i]);

        if (!liveCoords || !storedCoords) continue;

        const liveNorm = {
          x: liveCoords.x - liveCenter.x,
          y: liveCoords.y - liveCenter.y,
        };

        const storedNorm = {
          x: storedCoords.x - storedCenter.x,
          y: storedCoords.y - storedCenter.y,
        };

        const distance = Math.sqrt(
          Math.pow(liveNorm.x - storedNorm.x, 2) +
            Math.pow(liveNorm.y - storedNorm.y, 2)
        );

        const pointSimilarity = Math.exp(-distance / 50);
        totalSimilarity += pointSimilarity;
        validComparisons++;
      }

      const averageSimilarity = totalSimilarity / validComparisons;
      console.log("Average similarity:", averageSimilarity);

      return averageSimilarity;
    } catch (error) {
      console.error("Error in similarity calculation:", error);
      setDebug("Calculation error: " + error.message);
      return 0;
    }
  };

  const fetchStoredLandmarks = async () => {
    try {
      const { data, error } = await supabase
        .from("employee") // Assuming 'employee' table stores the landmarks and emails
        .select("face_landmark, email") // Make sure you're selecting the correct fields
        .eq("email", email)
        .single();

      if (error) {
        setDebug("Error fetching stored landmarks: " + error.message);
        console.error("Supabase error:", error);
        return null;
      }

      console.log("Fetched data:", data); // Check what data you're getting
      // No need to parse the data if it's already an object
      if (data && data.face_landmark) {
        return data.face_landmark; // Return the object directly
      } else {
        setDebug("No landmarks found for the provided email.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching stored landmarks:", error);
      setDebug("Error fetching stored landmarks: " + error.message);
      return null;
    }
  };

  const recognizeFace = async () => {
    if (!videoRef.current) return;

    try {
      const storedLandmarks = await fetchStoredLandmarks();
      if (!storedLandmarks) {
        setDebug("No stored face data found");
        return;
      }

      setDebug("Getting live face detection...");
      const detections = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceLandmarks();

      if (detections) {
        setDebug("Face detected, comparing landmarks...");
        const liveLandmarks = detections.landmarks.positions;

        console.log("Live landmarks:", liveLandmarks);
        console.log("Stored landmarks:", storedLandmarks);

        const similarityScore = calculateLandmarkSimilarity(
          liveLandmarks,
          storedLandmarks
        );
        const isMatch = similarityScore >= SIMILARITY_THRESHOLD;

        setMatch(isMatch);
        setDebug(
          `Final result: ${
            isMatch ? "Match" : "No match"
          } (score: ${similarityScore.toFixed(4)})`
        );

        stopVideo();
      } else {
        setDebug("No face detected in video");
      }
    } catch (error) {
      console.error("Recognition error:", error);
      setDebug("Recognition error: " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Face Recognition</h1>

      {loading ? (
        <p className="text-lg">Loading models...</p>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            muted
            className="rounded-lg shadow-lg border-2 border-gray-600"
            style={{ width: "640px", height: "480px" }}
          />
          <button
            onClick={recognizeFace}
            className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Recognize Face
          </button>
          {match !== null && (
            <p
              className={`mt-4 text-xl font-bold ${
                match ? "text-green-400" : "text-red-400"
              }`}
            >
              {match ? "✅ Face Matched!" : "❌ Face Not Matched!"}
            </p>
          )}
          <p className="mt-2 text-sm text-gray-400">{debug}</p>
        </>
      )}
    </div>
  );
};

export default FaceRecognition;
