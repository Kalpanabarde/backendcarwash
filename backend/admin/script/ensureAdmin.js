const bcrypt = require("bcryptjs");
const User = require("../models/userModel"); // adjust path
const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!ADMIN_EMAIL) throw new Error("Set ADMIN_EMAIL in environment variables");
if (!ADMIN_PASSWORD) throw new Error("Set ADMIN_PASSWORD in environment variables");

async function ensureAdmin() {
  try {
    // Check if admin exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists. No changes made.");
      return;
    }

    // Hash password securely
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Create admin user
    const newAdmin = await User.create({
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
      fullName: "Admin User",
      isActive: true,
    });

    console.log("✅ Admin created:", newAdmin.email);
  } catch (err) {
    console.error("❌ Error creating admin:", err);
  }
}

module.exports = { ensureAdmin };

























/**const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/userModel"); // path to your model

async function ensureAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL || "kalpana@gmail.com";
    const password = process.env.ADMIN_PASSWORD || "Admin@123";

    // Check if admin exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists. Skipping creation.");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const newAdmin = await User.create({
      email,
      password: hashedPassword,
      role: "admin",
      fullName: "Kalpana Admin",
      isActive: true,
    });

    console.log("✅ Admin created:", newAdmin.email);
  } catch (err) {
    console.error("❌ Error ensuring admin:", err);
  }
}

module.exports = { ensureAdmin };**/













