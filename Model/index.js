const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');
const Like = require('./Like');
const FriendRequest = require('./FriendRequest'); 
const Friend = require('./Friend');
const Message = require('./Message');

// ─────────────────────────────
// User ↔ Post
User.hasMany(Post, { foreignKey: 'userId', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'userId' });

// ─────────────────────────────
// User ↔ Comment
User.hasMany(Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'userId' });

Post.hasMany(Comment, { foreignKey: 'postId', onDelete: 'CASCADE' });
Comment.belongsTo(Post, { foreignKey: 'postId' });

// ─────────────────────────────
// User ↔ Like
User.hasMany(Like, { foreignKey: 'userId', onDelete: 'CASCADE' });
Like.belongsTo(User, { foreignKey: 'userId' });

Post.hasMany(Like, { foreignKey: 'postId', onDelete: 'CASCADE' });
Like.belongsTo(Post, { foreignKey: 'postId' });

// ─────────────────────────────
// User ↔ FriendRequest
User.hasMany(FriendRequest, {
  foreignKey: 'senderId',
  as: 'sentRequests',
  onDelete: 'CASCADE'
});
User.hasMany(FriendRequest, {
  foreignKey: 'receiverId', 
  as: 'receivedRequests',
  onDelete: 'CASCADE'
});

FriendRequest.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
FriendRequest.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

// ─────────────────────────────
// User ↔ Friend (Mutual Relationship)
User.belongsToMany(User, {
  through: Friend,
  as: 'Friends',
  foreignKey: 'userId1',
  otherKey: 'userId2'
});

// Message Relations
User.hasMany(Message, { foreignKey: 'senderId', as: 'SentMessages' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'ReceivedMessages' });

Message.belongsTo(User, { foreignKey: 'senderId', as: 'Sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'Receiver' });

module.exports = { 
  user: User,
  post: Post,
  comment: Comment,
  like: Like,
  friendRequest: FriendRequest ,
  friend: Friend,
  message: Message,
};
