const cors = require("cors");

const allowedOrigins = [
  "http://localhost:3000", // dev
  "https://your-real-frontend-domain.com", // prod
];

module.exports = cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
});
