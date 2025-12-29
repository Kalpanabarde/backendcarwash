require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const corsConfig = require("./middleware/corsConfig");

const app = express();

app.use(corsConfig);
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/carwash")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

app.use("/api", require("./routes/orderRoutes"));
app.use("/icons", express.static("icons"));


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
