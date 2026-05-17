const express = require('express');
const router  = express.Router();

const authApiRoutes    = require('./authApiRoutes');
const productApiRoutes = require('./productApiRoutes');
const orderApiRoutes   = require('./orderApiRoutes');
const userApiRoutes    = require('./userApiRoutes');

// Mount all API sub-routes
router.use('/auth',     authApiRoutes);
router.use('/products', productApiRoutes);
router.use('/orders',   orderApiRoutes);
router.use('/user',     userApiRoutes);

// 404 handler for unknown /api/v1/* routes
router.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `API route not found: ${req.method} ${req.originalUrl}`,
    });
});

module.exports = router;
