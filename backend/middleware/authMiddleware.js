// Simple example: check if req.headers.adminKey matches your key
exports.adminAuth = (req, res, next) => {
    const adminKey = req.headers.adminkey; // client should send this in headers
    if (adminKey && adminKey === process.env.ADMIN_KEY) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized, admin only' });
    }
};
