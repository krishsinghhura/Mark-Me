const jwt = require("jsonwebtoken");

const SUPABASE_JWT_SECRET =
  "mxhTyHz1Jxxf/tjbyx6E1kIT168MFk5mrfRB236phTPw4XE3Z1GR4yyb4+bz06pxfVH9Hu3qeOrHa/Pj7ZLGOA=="; // Replace with your Supabase JWT secret

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, SUPABASE_JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = decoded; // Add user details to request object
    next();
  });
};

module.exports = authenticateJWT;
