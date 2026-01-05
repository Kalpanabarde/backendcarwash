// Admin controllers

const adminDashboard = (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.email}` });
};

module.exports = { adminDashboard };
