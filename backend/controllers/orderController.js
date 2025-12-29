const Customer = require("../models/Customer");
const Order = require("../models/Order");

/* ================= CHECK CUSTOMER ================= */
exports.checkCustomerByPhone = async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) return res.status(400).json({ message: "Phone required" });

    const customer = await Customer.findOne({ phone });
    if (!customer) return res.json({ exists: false });

    const latestOrder = await Order.findOne({
      customerId: customer._id,
    }).sort({ createdAt: -1 });

    res.json({
      exists: true,
      data: {
        name: customer.name,
        cars: customer.cars,
        lastOrderAt: latestOrder?.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= CREATE ORDER ================= */
exports.createOrder = async (req, res) => {
  try {
    const { service, data, TotalPrice, paymentMethod, paymentStatus } = req.body;

    if (
      !service ||
      !data?.name ||
      !data?.phone ||
      !data?.quantity ||
      !Array.isArray(data.cars) ||
      data.cars.length === 0 ||
      !TotalPrice ||
      !paymentMethod
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let customer = await Customer.findOne({ phone: data.phone });

    if (!customer) {
      customer = await Customer.create({
        name: data.name,
        phone: data.phone,
        cars: data.cars,
      });
    } else {
      customer.cars = data.cars;
      await customer.save();
    }

    const invoiceNo = `INV-${Date.now()}`;

    const order = await Order.create({
      invoiceNo,
      customerId: customer._id,
      service,
      bill: {
        quantity: data.quantity,
        totalAmount: TotalPrice,
      },
      payment: {
        method: paymentMethod,
        status: paymentStatus || "pending",
      },
    });

    res.status(201).json({
      message: "Order saved successfully",
      data: order,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Customer already exists" });
    }
    res.status(500).json({ error: err.message });
  }
};

/* ================= GET ALL ORDERS ================= */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customerId")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= RESET ================= */
exports.resetOrders = async (req, res) => {
  try {
    await Order.deleteMany({});
    await Customer.deleteMany({});
    res.json({ message: "All orders and customers cleared." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
