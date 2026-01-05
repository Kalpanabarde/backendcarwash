const express = require("express");
const auth = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(auth, adminOnly);
router.get("/dashboard", (req, res) => {
  res.json({ message: "Admin dashboard" });
});

module.exports = router;
