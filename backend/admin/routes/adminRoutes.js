const express = require("express");
const auth = require("../middleware/authMiddleware");
const { protectRole } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(auth, protectRole);
router.get("/dashboard", (req, res) => {
  res.json({ message: "Admin dashboard" });
});

module.exports = router;
