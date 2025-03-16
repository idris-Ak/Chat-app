const express = require('express');
const router = express.Router();
const { register, login, logout, verifyToken, validateToken } = require('../controllers/authController');
const auth = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Rate limiter for registration
const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many registration attempts from this IP, please try again later.'
});

// Public routes
router.post('/register', registerLimiter, register);
router.post('/login', login);

// Protected routes
router.post('/logout', auth, logout);
router.get('/verify-token', auth, verifyToken);
router.post('/validate', validateToken);

module.exports = router;