const express     = require('express');
const router      = express.Router();
const userApiController = require('../../controllers/api/userApiController');
const verifyToken = require('../../middleware/verifyToken');

// GET /api/v1/user/profile  — JWT protected
router.get('/profile', verifyToken, userApiController.getProfile);

module.exports = router;
