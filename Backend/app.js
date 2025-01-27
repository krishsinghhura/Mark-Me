const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const geoLocationRoutes = require("./routes/geoLocation");
const employeeRoutes = require("./routes/employeeRoutes");
const cookieParser = require("cookie-parser");

const app = express();

dotenv.config();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: "http://localhost:5173", // Your frontend's URL
  methods: "GET,POST,PUT,DELETE", // Allowed HTTP methods
  allowedHeaders: ["Content-Type"], // Allowed headers
};
app.use(cors(corsOptions));
app.use("/", userRoutes);
app.use("/employee", employeeRoutes);

app.use("/employer", geoLocationRoutes);

module.exports = app;
