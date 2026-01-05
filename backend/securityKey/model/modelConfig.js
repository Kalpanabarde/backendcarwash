const mongoose = require("mongoose");

const securityKeySchema = new mongoose.Schema({
  keyHash: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  expiresAt: Date
}
,
  { timestamps: true }

);

module.exports = mongoose.model("SecurityKey", securityKeySchema);
