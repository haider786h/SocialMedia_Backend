const express = require('express');
const router = express.Router();
const userRoutes = require('./usersRoute');
const postRoutes = require('./postsRoute');
const commentRoutes = require('./commentsRoutes');
const likeRoutes = require('./likesRoutes');
const friendRoutes = require('./FriendsRoutes');
const messageRoutes = require('./messageRoutes');


router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);  
router.use('/likes', likeRoutes);  
router.use('/friends', friendRoutes);
router.use('/messages', messageRoutes);

module.exports = router;
