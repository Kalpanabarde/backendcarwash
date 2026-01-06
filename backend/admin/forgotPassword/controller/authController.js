// controllers/authController.js
const bcrypt = require("bcryptjs");
const User = require("../../models/userModel");
const sendSMS = require("../utils/sendSMS");

// ==============================
// STEP 1: Request OTP
// ==============================


exports.requestPasswordReset = async (req, res) => {
  try {
    const { phone } = req.body;

    // 1️⃣ Validate phone
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    console.log("Phone received:", phone);

    // 2️⃣ Find user
    const user = await User.findOne({ phone, role: "admin" });
    if (!user) {
      return res.status(404).json({ message: "Admin not found" });
    }

    console.log("User found:", user.email);

    // 3️⃣ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // 4️⃣ Save OTP to DB
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = otpExpiry;

    await user.save();
    console.log("OTP saved in DB:", otp);

    // 5️⃣ Send SMS (wrapped in try-catch so it doesn't break API)
    try {
      await sendSMS(phone, `Your OTP for password reset is ${otp}`);
      console.log("SMS sent successfully");
      return res.status(200).json({ message: "OTP sent to your phone" });
    } catch (smsError) {
      console.error("SMS sending failed:", smsError);
      return res
        .status(200)
        .json({ message: "OTP generated, but SMS sending failed" });
    }
  } catch (err) {
    console.error("Error in requestPasswordReset:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// STEP 2: Reset password
// ==============================
exports.resetPassword = async (req, res) => {
  try {
    const { phone, otp, newPassword } = req.body;

    if (!phone || !otp || !newPassword)
      return res.status(400).json({ message: "Phone, OTP, and new password are required" });

    const user = await User.findOne({
      phone,
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
