// models/associations.js
const User = require('./User');
const Post = require('./Post');
const Like = require('./Like');
const Comment = require('./Comment');
const Share = require('./Share');
const Notification = require('./Notification');
const Content = require('./Content');
const Vote = require('./Vote');
const Wishlist = require('./Wishlist');

// العلاقات بين User و Content من خلال التصويتات
User.belongsToMany(Content, {
  through: Vote,
  foreignKey: 'userId',
  otherKey: 'contentId',
  as: 'votedContents'
});

Content.belongsToMany(User, {
  through: Vote,
  foreignKey: 'contentId',
  otherKey: 'userId',
  as: 'voters'
});

// العلاقات One-to-Many
User.hasMany(Vote, {
  foreignKey: 'userId',
  as: 'votes'
});

Content.hasMany(Vote, {
  foreignKey: 'contentId',
  as: 'votes'
});

Vote.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Vote.belongsTo(Content, {
  foreignKey: 'contentId',
  as: 'content'
});


// العلاقات بين User و Post
User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// العلاقات بين User و Like
User.hasMany(Like, { foreignKey: 'userId', as: 'likes' });
Like.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Post.hasMany(Like, { foreignKey: 'postId', as: 'likes' });
Like.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

// العلاقات بين User و Comment
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

// العلاقات بين User و Share
User.hasMany(Share, { foreignKey: 'userId', as: 'shares' });
Share.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Post.hasMany(Share, { foreignKey: 'postId', as: 'shares' });
Share.belongsTo(Post, { foreignKey: 'postId', as: 'post' });


Post.belongsTo(Post, { foreignKey: 'originalPostId', as: 'originalPost' });
Post.hasMany(Post, { foreignKey: 'originalPostId', as: 'sharedPosts' });

// العلاقات بين User و Notification
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Notification, { foreignKey: 'targetUserId', as: 'receivedNotifications' });
Notification.belongsTo(User, { foreignKey: 'targetUserId', as: 'targetUser' });

// العلاقات المرجعية للإشعارات
Notification.belongsTo(Post, { foreignKey: 'postId', as: 'post' });
Notification.belongsTo(Comment, { foreignKey: 'commentId', as: 'comment' });
// العلاقات الخاصة بقائمة الأمنيات
User.belongsToMany(Content, {
  through: Wishlist,
  foreignKey: 'userId',
  otherKey: 'contentId',
  as: 'wishlistContents'
});

Content.belongsToMany(User, {
  through: Wishlist,
  foreignKey: 'contentId',
  otherKey: 'userId',
  as: 'wishlistedBy'
});

User.hasMany(Wishlist, {
  foreignKey: 'userId',
  as: 'wishlistItems'
});

Content.hasMany(Wishlist, {
  foreignKey: 'contentId',
  as: 'wishlistEntries'
});

Wishlist.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Wishlist.belongsTo(Content, {
  foreignKey: 'contentId',
  as: 'content'
});

module.exports = {
  User,
  Content,
  Vote,
  Post,
  Like,
  Comment,
  Share,
  Notification
};