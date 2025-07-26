const express = require('express');
const router = express.Router();
const postController = require('../Controller/Post');
const auth = require('../Middleware/auth'); // JWT middleware
const upload = require('../Middleware/upload')


// 🔐 Create a post (Protected)
router.post('/', auth, upload.single('image'), postController.createPost);

// 🔓 Get all posts (Public)
router.get('/', postController.getAllPosts);

// Get post by id
router.get('/:id', postController.getPostById);


module.exports = router;
