const express = require("express");
const router = express.Router();
const {getServices} = require('../controllers/serviceController');


//user end 
router.get('/service', getServices);





module.exports = router;




