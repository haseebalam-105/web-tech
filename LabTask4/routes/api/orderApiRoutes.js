const express     = require('express');
const router      = express.Router();
const orderApiController = require('../../controllers/api/orderApiController');
const verifyToken = require('../../middleware/verifyToken');

// POST /api/v1/orders  — JWT protected
router.post('/', verifyToken, orderApiController.createOrder);

module.exports = router;
