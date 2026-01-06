// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { requestPasswordReset, resetPassword } = require("../controller/authController");

// Request OTP
router.post("/password-reset/request", requestPasswordReset);

// Reset password with OTP
router.post("/password-reset/verify", resetPassword);

module.exports = router;
