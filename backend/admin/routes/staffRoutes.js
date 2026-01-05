const express = require("express");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.use(auth);
router.get("/tasks", (req, res) => {
  res.json({ message: "Staff data" });
});

module.exports = router;
