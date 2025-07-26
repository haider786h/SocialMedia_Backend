const express = require('express');
const router = express.Router();
const likeController = require('../Controller/Like');
const authenticate = require('../Middleware/auth');

// ✅ Register static routes first
router.get('/check/:postId', authenticate, likeController.checkIfLiked);
router.post('/like', authenticate, likeController.likePost);

// ✅ This is the missing route
router.get('/:postId', likeController.getLikesByPost);

module.exports = router;
