import Service from "../service/models/Service.js";


// Temporary in-memory services for GET API
const services = [
  { label: "Water Wash", icon: "water.png", price: 5 },
  { label: "Sedan Body Wash", icon: "icon8.png", price: 10 },
  { label: "SUV Body Wash", icon: "icon6.png", price: 15 },
  { label: "Sedan Full Wash", icon: "icon2.png", price: 20 },
  { label: "SUV Full Wash", icon: "icon3.png", price: 25 },
  { label: "Sedan Full Wash with Wax", icon: "icon5.png", price: 30 },
  { label: "SUV Full Wash with Wax", icon: "icon4.png", price: 50 },
  { label: "Sedan Full wash Engine", icon: "icon7.png", price: 50 },
];


// GET all services (temporary)
export const getServices = async (req, res) => {
  try {
    const {
      _sort = 'price',
      _order = 'ASC',
    } = req.query;

    const sortOrder = _order === 'ASC' ? 1 : -1;

    const dbServices = await Service.find()
      .sort({ [_sort]: sortOrder });

    res.status(200).json(dbServices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET single service by ID
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// POST new service (DB)
export const addService = async (req, res) => {
  try {
    const { label, icon, price } = req.body;
    const newService = new Service({ label, icon, price });
    await newService.save();
    res.status(201).json(newService);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT update service
export const updateService = async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedService) {
      return res.status(404).json({ error: "Service not found" });
    }

    // Map _id -> id for RA convenience
    const serviceWithId = {
      ...updatedService.toObject(),
      id: updatedService._id,
    };

    res.json(serviceWithId);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// DELETE service
export const deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
