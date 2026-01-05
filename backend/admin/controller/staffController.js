// Staff controllers

const staffDashboard = (req, res) => {
  res.json({ message: `Welcome Staff ${req.user.email}` });
};

module.exports = { staffDashboard };
