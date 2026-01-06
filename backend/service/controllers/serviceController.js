const Service = require("../models/service.js");

// GET services
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({ status: "active" });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Error fetching services" });
  }
};


exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};






// POST – Add new service (admin)
exports.createService = async (req, res) => {
  try {
    const { label, icon, price } = req.body;

    const service = new Service({
      label,
      icon,
      price,
      status: "active", // ✅ explicit
    });

    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: "Error creating service" });
  }
};


// PUT – Update price (admin)
exports.updateServicePrice = async (req, res) => {
  try {
    const { price } = req.body;

    if (price === undefined) {
      return res.status(400).json({ message: "Price is required" });
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { price },
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // ✅ return updated record
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: "Error updating price" });
  }
};


// DELETE – Disable service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { status: "inactive" },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // ✅ React-Admin compatible response
    res.json({ id: service._id });
  } catch (err) {
    res.status(500).json({ message: "Error deleting service" });
  }
};
