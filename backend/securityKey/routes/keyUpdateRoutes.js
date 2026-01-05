const express = require("express");
const router = express.Router();
const {  getActiveKey, rotateKey } = require("../controller/keyUpdateController");
const { protectAdmin } = require("../middleware/authMiddleware");
const { protectRole } = require("../middleware/roleMiddleware");

router.get("/keys/active", protectAdmin, getActiveKey);
//router.post("/keys/deactivate/:id", protectAdmin, deactivateKey);
router.post("/keys/rotate", protectAdmin, protectRole, rotateKey);


module.exports = router; // ✅ make sure this line exists
