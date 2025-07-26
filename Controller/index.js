const userController = require('./User');
const postController = require('./Post');
const commentController = require('./Comment');
const likeController = require('./Like');
const friendRequestController = require('./FriendRequest');

module.exports = {
  userController,
  postController,
  commentController,
  likeController,
  friendRequestController
};
