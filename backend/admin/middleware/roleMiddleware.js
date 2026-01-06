// roleMiddleware.js
// middleware/authMiddleware.js
//const jwt = require("jsonwebtoken");
//const Admin = require("../../model/userModel"); // <-- use the actual Admin schema


exports.protectRole = (req, res, next) => {
  // Make sure req.user exists first
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: No user found" });
  }

  // Check if the user's role is admin
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admin only" });
  }

  // If admin, allow request to continue
  next();
};
