const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: String,
    phone: { type: String, unique: true },
    cars: [
      {
        carName: String,
        carNumber: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
