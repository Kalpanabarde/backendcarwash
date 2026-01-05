const express = require("express");
const router = express.Router();
const { verifyKey } = require("../controller/discountController");

// 🔓 NO middleware here
router.post("/verify", verifyKey);

module.exports = router;
