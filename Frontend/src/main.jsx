import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <App />
    </StrictMode>
  </BrowserRouter>
);
