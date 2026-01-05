// routes/securityKeyRoutes.js
const express = require("express");
const router = express.Router();
const { createKey} = require("../controller/discountController");
const { protectAdmin } = require("../middleware/authMiddleware");

// Only admin can generate key
router.post("/create", protectAdmin, createKey);

// Staff can only verify key
//router.post("/verify", verifyKey);

module.exports = router;
