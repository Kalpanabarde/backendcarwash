const express = require("express");
const router = express.Router();
const { getServices, getServiceById, createService, updateServicePrice, deleteService} = require('../controllers/serviceController');
const { protectAdmin } = require('../middleware/authMiddleware');




//for admin access only
router.get('/service', protectAdmin, getServices);
router.get('/service/:id', protectAdmin, getServiceById);
router.post('/service/create', protectAdmin, createService);
router.put('/service/:id', protectAdmin, updateServicePrice);
router.delete('/service/:id', protectAdmin, deleteService);




module.exports = router;




