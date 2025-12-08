// controllers/postController.js
const postService = require('../services/postService');
const interactionService = require('../services/interactionService');

class PostController {
  // إنشاء منشور جديد
  async createPost(req, res) {
    try {
      const { content, userId } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : null;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'معرف المستخدم مطلوب'
        });
      }

      console.log('Creating post with:', { content, image, userId });

      const post = await postService.createPost(userId, content, image);
      
      res.status(201).json({
        success: true,
        data: post
      });
    } catch (error) {
      console.error('Error in createPost:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // الحصول على جميع المنشورات
  async getPosts(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const posts = await postService.getAllPosts(page, limit);
      
      res.json({
        success: true,
        data: posts.rows,
        pagination: {
          page,
          limit,
          total: posts.count,
          pages: Math.ceil(posts.count / limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // الحصول على منشور محدد
  async getPost(req, res) {
    try {
      const { id } = req.params;
      const post = await postService.getPostById(id);
      
      res.json({
        success: true,
        data: post
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // حذف منشور
  async deletePost(req, res) {
    try {
      const { id } = req.params;
      // const { userId } = req.body;

      // if (!userId) {
      //   return res.status(400).json({
      //     success: false,
      //     message: 'معرف المستخدم مطلوب'
      //   });
      // }

      const result = await postService.deletePost(id);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // إضافة إعجاب
  async likePost(req, res) {
    try {
      const { postId } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'معرف المستخدم مطلوب'
        });
      }

      const result = await interactionService.addLike(userId, postId);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // إضافة تعليق
  async commentOnPost(req, res) {
    try {
      const { postId } = req.params;
      const { content, userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'معرف المستخدم مطلوب'
        });
      }

      const comment = await interactionService.addComment(userId, postId, content);
      
      res.status(201).json({
        success: true,
        data: comment
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // مشاركة منشور
  async sharePost(req, res) {
    try {
      const { postId } = req.params;
      const { sharedContent, userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'معرف المستخدم مطلوب'
        });
      }

      const result = await interactionService.sharePost(userId, postId, sharedContent);
      
      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async updatePost(req, res) {
    try {
      const { id } = req.params;
      const { content, userId } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : undefined;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'معرف المستخدم مطلوب'
        });
      }

      console.log('Updating post with:', { id, content, image, userId });

      const updatedPost = await postService.updatePost(id, userId, content, image);
      
      res.json({
        success: true,
        data: updatedPost
      });
    } catch (error) {
      console.error('Error in updatePost:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  // الحصول على تعليقات المنشور
  async getPostComments(req, res) {
    try {
      const { postId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const comments = await interactionService.getPostComments(postId, page, limit);
      
      res.json({
        success: true,
        data: comments.rows,
        pagination: {
          page,
          limit,
          total: comments.count,
          pages: Math.ceil(comments.count / limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}


module.exports = new PostController();