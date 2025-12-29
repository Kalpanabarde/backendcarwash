const express = require("express");
const router = express.Router();
const controller = require("../controllers/orderController");
const serviceController = require('../controllers/serviceController');
const { adminAuth } = require('../middleware/authMiddleware');

router.get("/customer/by-phone", controller.checkCustomerByPhone);
router.get('/services', serviceController.getServices);
router.post("/orders", controller.createOrder);
router.get("/orders", controller.getAllOrders);
router.delete("/orders/reset", controller.resetOrders);

//admin panel
router.post('/services', adminAuth, serviceController.addService);
router.put('/services/:id', adminAuth, serviceController.updateService);
router.delete('/services/:id', adminAuth, serviceController.deleteService);




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
