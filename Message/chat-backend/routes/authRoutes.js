const express = require('express');
const router = express.Router();
const { register, login, logout, verifyToken, validateToken } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', auth, logout);
router.get('/verify-token', auth, verifyToken);
router.post('/validate', validateToken);

module.exports = router;