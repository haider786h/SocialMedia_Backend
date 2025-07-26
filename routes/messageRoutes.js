const express = require('express');
const router = express.Router();
const messageController = require('../Controller/Message');
const authenticate = require('../Middleware/auth');

// Send a message
router.post('/send', authenticate, messageController.sendMessage);

// Get chat between current user and another user
router.get('/:otherUserId', authenticate, messageController.getChatWithUser);

module.exports = router;
    