const jwt = require("jsonwebtoken");
const Admin = require("../../admin/models/userModel");

exports.protectAdmin = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminUser = await Admin.findById(decoded.id);

    if (!adminUser) return res.status(401).json({ message: "Not authorized" });

    if (adminUser.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin only" });
    }

    req.user = adminUser;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
