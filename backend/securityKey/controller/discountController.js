// controllers/securityKeyController.js
const SecurityKey = require("../model/modelConfig");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

/**
 * ADMIN ONLY
 * Generate and save security key in database
 */
exports.createKey = async (req, res) => {
  try {
    const adminId = req.user.id; // 🔐 from JWT middleware

    // 🔑 generate strong random key (32 bytes → 64 hex chars)
    const rawKey = crypto.randomBytes(32).toString("hex");

    // 🔒 hash key before saving
    const hashedKey = await bcrypt.hash(rawKey, 10);

    // 🗄️ save in DB with 1 month expiry
    const newKey = await SecurityKey.create({
      keyHash: hashedKey,
      createdBy: adminId,
      active: true,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 1 month
    });

    // ⚠️ return raw key ONLY ONCE
    res.status(201).json({
      success: true,
      key: rawKey,
      expiresAt: newKey.expiresAt
    });

  } catch (err) {
    console.error("CREATE KEY ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Error creating security key"
    });
  }
};

/**
 * STAFF / SYSTEM
 * Verify security key
 */
exports.verifyKey = async (req, res) => {
  try {
    const { key } = req.body;

    if (!key) {
      return res.status(400).json({
        success: false,
        message: "Security key missing"
      });
    }

    const keyRecords = await SecurityKey.find({ active: true });

    let matchedKey = null;
    for (const record of keyRecords) {
      const isMatch = await bcrypt.compare(key, record.keyHash);
      if (isMatch) {
        // ✅ Check expiry
        if (record.expiresAt && record.expiresAt < new Date()) {
          return res.status(400).json({
            success: false,
            message: "Security key expired"
          });
        }
        matchedKey = record;
        break;
      }
    }

    if (!matchedKey) {
      return res.status(400).json({
        success: false,
        message: "Invalid security key"
      });
    }

    res.json({
      success: true,
      message: "Security key verified"
    });

  } catch (err) {
    console.error("VERIFY KEY ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
