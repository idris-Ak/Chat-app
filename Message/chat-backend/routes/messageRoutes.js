const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, markAsRead } = require('../controllers/messageController');
const auth = require('../middleware/auth');

// All routes are protected
router.post('/', auth, sendMessage);
router.get('/conversation/:userId', auth, getMessages);
router.put('/mark-read/:messageId', auth, markAsRead);

module.exports = router;