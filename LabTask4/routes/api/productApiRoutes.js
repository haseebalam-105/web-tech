const express = require('express');
const router  = express.Router();
const productApiController = require('../../controllers/api/productApiController');

// GET /api/v1/products
router.get('/', productApiController.getAllProducts);

// GET /api/v1/products/:id
router.get('/:id', productApiController.getProductById);

module.exports = router;
