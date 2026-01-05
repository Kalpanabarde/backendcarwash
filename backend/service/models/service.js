const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    label: String,
    icon: String,
    price: Number,
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",   // 🔥 THIS FIXES EVERYTHING
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);














/**const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    label: { type: String, required: true },
    icon: { type: String }, // optional: store icon name/path
    price: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);**/
