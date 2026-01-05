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
        method: paymentMethod.toLowerCase(),
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



/* ================= GET ORDER BY ID ================= */
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "ID required" });

    // Fetch order and populate customer details
    const order = await Order.findById(id).populate("customerId");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
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


/* ================= GET ALL CUSTOMERS ================= */
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= GET CUSTOMER BY ID ================= */
exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "ID required" });

    const customer = await Customer.findById(id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.createCustomer = async (req, res) => {
  try {
    const { name, phone, cars } = req.body;

    if (!name || !phone || !Array.isArray(cars) || cars.length === 0) {
      return res.status(400).json({ message: "Name, phone, and at least one car are required" });
    }

    const existingCustomer = await Customer.findOne({ phone });
    if (existingCustomer) {
      return res.status(409).json({ message: "Customer already exists" });
    }

    const customer = await Customer.create({ name, phone, cars });

    // Convert to plain object and rename _id to id
    const customerObj = customer.toObject();
    customerObj.id = customerObj._id;
    delete customerObj._id;
    delete customerObj.__v;

    // Return the record directly at top level
    res.status(201).json(customerObj);
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

/* ================= UPDATE ORDER BY ID ================= */
exports.updateOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const { service, bill, payment } = req.body;

    if (!id) return res.status(400).json({ message: "Order ID required" });

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update only provided fields
    if (service) order.service = service;
    if (bill?.quantity) order.bill.quantity = bill.quantity;
    if (bill?.totalAmount) order.bill.totalAmount = bill.totalAmount;
    if (payment?.method) order.payment.method = payment.method;
    if (payment?.status) order.payment.status = payment.status;

    await order.save();

    res.json({
      message: "Order updated successfully",
      data: order,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= DELETE ORDER BY ID ================= */
exports.deleteOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "Order ID required" });

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Order deleted successfully",
      deletedId: id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.updateCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, cars } = req.body;

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (name) customer.name = name;
    if (phone) customer.phone = phone;
    if (Array.isArray(cars)) customer.cars = cars;

    await customer.save();

    res.json({
      message: "Customer updated successfully",
      data: customer,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Optional: delete related orders
    await Order.deleteMany({ customerId: id });

    res.json({ message: "Customer deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
