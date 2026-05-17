const express  = require('express');
const router   = express.Router();
const auth     = require('../controllers/authController');
const { isLoggedIn } = require('../middleware/auth');

router.get('/register',  auth.getRegister);
router.post('/register', auth.postRegister);
router.get('/login',     auth.getLogin);
router.post('/login',    auth.postLogin);
router.get('/logout',    auth.getLogout);
router.get('/profile',   isLoggedIn, auth.getProfile);

module.exports = router;
