//local testing 

const cors = require("cors");

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:4000",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:4000",
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // 🔥 TEMP allow all (DEV ONLY)
    }
  },
  credentials: true,
};

module.exports = cors(corsOptions);














//for production this code use
/**const cors = require("cors");

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
});**/
