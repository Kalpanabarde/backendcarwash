require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const corsConfig = require("./middleware/corsConfig");
const authRoutes = require("./admin/routes/authRoutes");
const adminRoutes = require("./admin/routes/adminRoutes");
const staffRoutes = require("./admin/routes/staffRoutes");
const { ensureAdmin } = require("./admin/script/ensureAdmin"); 
const forgotPasswordRoutes = require("./admin/forgotPassword/routes/authRoutes");
const discountKeyRoutes = require("./securityKey/routes/discountRoutes");
const verifyKeyRoutes = require("./securityKey/routes/verifyRoutes");
const keyUpdateRoutes = require("./securityKey/routes/keyUpdateRoutes");
const serviceRoutes = require("./service/routes/serviceRoutes");

const app = express();

app.use(corsConfig);
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/carwash")
  .then(async() => {console.log("✅ MongoDB connected")
  
  await ensureAdmin();
  
  })
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

app.use("/api", require("./routes/orderRoutes"));
app.use("/icons", express.static("icons"));
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/auth", forgotPasswordRoutes);
app.use("/api/admin/discount", discountKeyRoutes);
app.use("/api/discount", verifyKeyRoutes);
app.use("/api/admin", keyUpdateRoutes);
app.use("/api/admin", serviceRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
