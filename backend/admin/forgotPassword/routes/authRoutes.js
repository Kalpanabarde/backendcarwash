const express = require("express");
const { forgotPassword, resetPassword } = require("../controller/authController");

const router = express.Router();

// POST /api/auth/forgot-password
router.post("/forgot-password", forgotPassword);

// POST /api/auth/reset-password/:token
router.post("/reset-password/:token", resetPassword);

module.exports = router;
