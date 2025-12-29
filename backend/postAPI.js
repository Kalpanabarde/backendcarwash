require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());//frontend domain is hosted here
app.use(express.json());

<<<<<<< HEAD
/* ================= DB CONNECTION ================= */
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Atlas connected"))
  .catch((err) => console.log("❌ DB Error:", err));

/* ================= COUNTER SCHEMA ================= */
const CounterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 1 }
});
=======
/* ================= MONGODB CONNECTION ================= */
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/carwash")//later connection change for production
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

/* ================= SCHEMAS ================= */
>>>>>>> 8227dca (update API Code)

// CUSTOMER (no duplicates by phone)
const customerSchema = new mongoose.Schema(
  {
    name: String,
    phone: { type: String, unique: true },
    cars: [
      {
        carName: String,
        carNumber: String
      }
    ]
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);

// ORDER (history preserved)
const orderSchema = new mongoose.Schema(
  {
    invoiceNo: String,
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
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

const Order = mongoose.model("Order", orderSchema);

/* ================= CHECK CUSTOMER BY PHONE ================= */
app.get("/api/customer/by-phone", async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) return res.status(400).json({ message: "Phone required" });

    const customer = await Customer.findOne({ phone });
    if (!customer) return res.json({ exists: false });

    // latest order
    const latestOrder = await Order.findOne({ customerId: customer._id }).sort({ createdAt: -1 });

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
});

<<<<<<< HEAD
const Order = mongoose.model("Order", OrderSchema);

/* ================= CHECK CUSTOMER BY PHONE ================= */
app.get("/api/customer/by-phone", async (req, res) => {
  try {
    const { phone } = req.query;

    if (!phone) {
      return res.status(400).json({ message: "Phone number required" });
    }

    const order = await Order.findOne(
      { "customer.phone": phone },
      { customer: 1 }
    ).sort({ createdAt: -1 });

    if (!order) {
      return res.json({ exists: false });
    }

    res.json({
      exists: true,
      data: {
        name: order.customer.name,
        cars: order.customer.cars
      }
    });

  } catch (error) {
    console.error("GET customer error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

=======
>>>>>>> 8227dca (update API Code)
/* ================= CREATE ORDER ================= */
app.post("/api/orders", async (req, res) => {
  try {
    console.log("Received POST body:", req.body); // debug

<<<<<<< HEAD
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
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    /* INVOICE NUMBER */
    const counter = await Counter.findOneAndUpdate(
      { name: "invoice" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const invoiceNo = `INV-${String(counter.seq).padStart(5, "0")}`;

    const newOrder = new Order({
      invoiceNo,
      customer: {
=======
    const { service, data, TotalPrice, paymentMethod, paymentStatus } = req.body;

    if (!service || !data?.name || !data?.phone || !data?.quantity || !Array.isArray(data.cars) || data.cars.length === 0 || !TotalPrice || !paymentMethod) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1️⃣ Find or create customer
    let customer = await Customer.findOne({ phone: data.phone });

    if (!customer) {
      customer = await Customer.create({
>>>>>>> 8227dca (update API Code)
        name: data.name,
        phone: data.phone,
        cars: data.cars,
      });
    } else {
      // Update cars if changed
      customer.cars = data.cars;
      await customer.save();
    }

    // 2️⃣ Invoice number
    const invoiceNo = `INV-${Date.now()}`;

    // 3️⃣ Create order
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
<<<<<<< HEAD
      data: savedOrder
    });

  } catch (error) {
    console.error("POST order error:", error);
    res.status(500).json({ message: "Server error" });
=======
      data: order,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Customer already exists" });
    }
    res.status(500).json({ error: err.message });
>>>>>>> 8227dca (update API Code)
  }
});

/* ================= GET ALL ORDERS ================= */
app.get("/api/orders", async (req, res) => {
  try {
<<<<<<< HEAD
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
=======
    const orders = await Order.find()
      .populate("customerId")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= RESET ORDERS ================= */
app.delete("/api/orders/reset", async (req, res) => {
  try {
    await Order.deleteMany({});
    await Customer.deleteMany({});
    res.json({ message: "All orders and customers cleared." });
  } catch (err) {
    res.status(500).json({ error: err.message });
>>>>>>> 8227dca (update API Code)
  }
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 4000;
<<<<<<< HEAD
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
=======
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
>>>>>>> 8227dca (update API Code)
