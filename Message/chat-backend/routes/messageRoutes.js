const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, markAsRead, getAllMessages, createMessage } = require('../controllers/messageController');
const auth = require('../middleware/auth');

router.post('/send', auth, sendMessage);
router.get('/conversation/:userId', auth, getMessages);
router.put('/mark-read/:messageId', auth, markAsRead);
router.get('/', getAllMessages);
router.post('/', createMessage);

module.exports = router;