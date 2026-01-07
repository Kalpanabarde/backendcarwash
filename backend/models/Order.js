const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    invoiceNo: String,
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    service: String,
    bill: {
      quantity: Number,
      totalAmount: Number,
    },
    payment: {
      method: String,
      status: { type: String, default: "pending" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
