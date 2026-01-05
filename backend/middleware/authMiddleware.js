exports.adminAuth = (req, res, next) => {
  console.log("Received admin key from frontend:", req.headers.adminkey);

  if (req.headers.adminkey === process.env.ADMIN_KEY) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized, admin only' });
  }
};







// Simple example: check if req.headers.adminKey matches your key
/**exports.adminAuth = (req, res, next) => {
    const adminKey = req.headers.adminkey; // client should send this in headers
    if (adminKey && adminKey === process.env.ADMIN_KEY) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized, admin only' });
    }
};

console.log("Backend key:", process.env.ADMIN_KEY);**/
