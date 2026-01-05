const express = require("express");
const router = express.Router();
const controller = require("../controllers/orderController");
//const serviceController = require('../controllers/serviceController');
//const { adminAuth } = require('../middleware/authMiddleware');

router.get("/customer/by-phone", controller.checkCustomerByPhone);
//router.get('/service', serviceController.getServices);
//router.get("/service/:id", serviceController.getServiceById);
router.post("/orders", controller.createOrder);
router.get("/orders", controller.getAllOrders);
router.get("/orders/:id", controller.getOrderById); 
router.post("/customers", controller.createCustomer);
router.get("/customers", controller.getAllCustomers);      // Get all customers
router.get("/customers/:id", controller.getCustomerById);
router.put("/orders/:id", controller.updateOrderById);
router.delete("/orders/:id", controller.deleteOrderById);
router.put("/customers/:id", controller.updateCustomerById);
router.delete("/customers/:id", controller.deleteCustomerById);
router.delete("/orders/reset", controller.resetOrders);

// routes/service.routes.js
//router.get("/", serviceController.getServices); // public
//temepraory comment
//router.post('/service/create', serviceController.addService);
//router.put('/service/:id', serviceController.updateService);
//router.delete('/service/:id', serviceController.deleteService);







module.exports = router;




/**const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { adminAuth } = require('../middleware/authMiddleware');

// Public route: get services
router.get('/services', serviceController.getServices);

// Admin routes
router.post('/services', adminAuth, serviceController.addService);
router.put('/services/:id', adminAuth, serviceController.updateService);
router.delete('/services/:id', adminAuth, serviceController.deleteService);

module.exports = router;**/
