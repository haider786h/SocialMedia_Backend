const express = require('express');
const router = express.Router();
const commentController = require('../Controller/Comment');
const auth = require('../Middleware/auth'); 
const likeRoutes = require('./likesRoutes');

// 🔐 Create a comment (requires login)
router.post('/', auth, commentController.createComment);

// 🔍 Get comments for a specific post
router.get('/:postId', commentController.getCommentsByPost);

// router.use('/posts', likeRoutes);

module.exports = router;
