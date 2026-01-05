const crypto = require("crypto");

// Generate 6-character alphanumeric key
function generateKey() {
  return crypto.randomBytes(3).toString("hex").toUpperCase(); // e.g., "A1B2C3"
}

module.exports = generateKey;
