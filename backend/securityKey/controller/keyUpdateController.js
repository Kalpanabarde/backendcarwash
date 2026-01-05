const SecurityKey = require("../model/modelConfig");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");



// Helper: check admin
const isAdmin = (req) => req.user?.role === "admin"; // assume req.user is set by auth middleware


exports.getActiveKey = async (req, res) => {
    try {
        const key = await SecurityKey.findOne({ active: true }).sort({ createdAt: -1 });
        if (!key) return res.status(404).json({ message: "No active key" });
        res.json(key);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch key" });
    }
};





// Deactivate a key
/**exports.deactivateKey = async (req, res) => {
    try {
        if (!isAdmin(req)) return res.status(403).json({ message: "Forbidden: Admins only" });

        const { id } = req.params;
        const key = await SecurityKey.findById((
            id,
            { active: false },
            { new: true }  // return the updated doc
        ));

        if (!key) return res.status(404).json({ message: "Key not found" });

        if (!key.active) return res.status(400).json({ message: "Key already inactive" });

        key.active = false;
        await key.save();

        res.status(200).json({ message: "Key deactivated successfully", key });
    } catch (err) {
        console.error("Deactivate Key Error:", err);
        res.status(500).json({ message: "Failed to deactivate key" });
    }
};**/

// Rotate key (deactivate old + generate new)
exports.rotateKey = async (req, res) => {
    const futureDate = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
    );


    try {
        console.log("Rotate key requested by:", req.user.email);

        // 1️⃣ Deactivate old keys
        await SecurityKey.updateMany({ active: true }, { active: false });

        // 2️⃣ Generate new key hash
        const rawKey = crypto.randomBytes(32).toString("hex");
        const hashedKey = await bcrypt.hash(rawKey, 10);

        // 3️⃣ Create new SecurityKey
        const newKey = await SecurityKey.create({
            keyHash: hashedKey,
            createdBy: req.user._id,
            expiresAt: futureDate
        });

        console.log("New key created:", newKey);

        res.status(200).json({
            message: "Key rotated successfully",
            key: rawKey,
            expiresAt: newKey.expiresAt
        });
    } catch (err) {
        console.log("Rotate Key Error:", err);
        res.status(500).json({ message: "Failed to rotate key", error: err.message });
    }
};
