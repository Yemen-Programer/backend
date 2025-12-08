// services/interactionService.js
const { Like, Comment, Share, Post, Notification, User } = require('../models/associations');

class InteractionService {
  // إضافة إعجاب
  async addLike(userId, postId) {
    try {
      const existingLike = await Like.findOne({
        where: { userId, postId }
      });

      if (existingLike) {
        await existingLike.destroy();
        await Post.decrement('likesCount', { where: { id: postId } });
        return { liked: false };
      }

      const like = await Like.create({ userId, postId });
      await Post.increment('likesCount', { where: { id: postId } });

      // إنشاء إشعار للمستخدم صاحب المنشور
      const post = await Post.findByPk(postId, { include: ['user'] });
      if (post.userId !== userId) {
        await Notification.create({
          userId: post.userId,
          targetUserId: userId,
          type: 'like',
          message: `${(await User.findByPk(userId)).name} أعجب بمنشورك`,
          postId,
          metadata: { likeId: like.id }
        });
      }

      return { liked: true, like };
    } catch (error) {
      throw new Error(`Error adding like: ${error.message}`);
    }
  }

  // إضافة تعليق
  async addComment(userId, postId, content) {
    try {
      const comment = await Comment.create({
        userId,
        postId,
        content
      });

      await Post.increment('commentsCount', { where: { id: postId } });

      // إضافة معلومات المستخدم للتعليق
      const commentWithUser = await Comment.findByPk(comment.id, {
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        }]
      });

      // إنشاء إشعار للمستخدم صاحب المنشور
      const post = await Post.findByPk(postId, { include: ['user'] });
      if (post.userId !== userId) {
        await Notification.create({
          userId: post.userId,
          targetUserId: userId,
          type: 'comment',
          message: `${(await User.findByPk(userId)).name} علق على منشورك`,
          postId,
          commentId: comment.id,
          metadata: { comment: content.substring(0, 50) }
        });
      }

      return commentWithUser;
    } catch (error) {
      throw new Error(`Error adding comment: ${error.message}`);
    }
  }

  // مشاركة منشور
  async sharePost(userId, postId, sharedContent = null) {
    try {
      const share = await Share.create({
        userId,
        postId,
        sharedContent
      });

      await Post.increment('sharesCount', { where: { id: postId } });

      // إنشاء منشور جديد للمشاركة
      const originalPost = await Post.findByPk(postId, {
        include: ['user']
      });

      const sharedPost = await Post.create({
        userId,
        content: sharedContent || `شارك منشور ${originalPost.user.name}`,
        image: originalPost.image,
        originalPostId: postId
      });

      // إنشاء إشعار للمستخدم صاحب المنشور
      if (originalPost.userId !== userId) {
        await Notification.create({
          userId: originalPost.userId,
          targetUserId: userId,
          type: 'share',
          message: `${(await User.findByPk(userId)).name} شارك منشورك`,
          postId,
          metadata: { shareId: share.id }
        });
      }

      return { share, sharedPost };
    } catch (error) {
      throw new Error(`Error sharing post: ${error.message}`);
    }
  }

  // الحصول على تعليقات المنشور
  async getPostComments(postId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const comments = await Comment.findAndCountAll({
        where: { postId },
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        }],
        order: [['createdAt', 'DESC']],
        limit,
        offset
      });

      return comments;
    } catch (error) {
      throw new Error(`Error fetching comments: ${error.message}`);
    }
  }
}

module.exports = new InteractionService();