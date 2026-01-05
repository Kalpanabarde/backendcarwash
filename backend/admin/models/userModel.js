// models/userModel.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String },
  role: { type: String, default: "user" },
  isActive: { type: Boolean, default: true },

  // Fields for password reset
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

module.exports = mongoose.model("User", userSchema);
