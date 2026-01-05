const express = require("express");
const router = express.Router();
//const controller = require("../controllers/orderController");
const {getServices, createService, updateServicePrice, deleteService} = require('../controllers/serviceController');
const { protectAdmin } = require('../middleware/authMiddleware');




//middleware authentication remove for temperory
router.get('/service', protectAdmin, getServices);
router.post('/service', protectAdmin, createService);
router.put('/service/:id', protectAdmin, updateServicePrice);
router.delete('/service/:id', protectAdmin, deleteService);




module.exports = router;




