// services/postService.js
const { Post, User, Like, Comment, Share } = require('../models/associations');

class PostService {
  // إنشاء منشور جديد
  async createPost(userId, content, image = null) {
    try {
      const post = await Post.create({
        userId,
        content,
        image
      });

      // إضافة معلومات المستخدم
      const postWithUser = await Post.findByPk(post.id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          }
        ]
      });

      return postWithUser;
    } catch (error) {
      throw new Error(`Error creating post: ${error.message}`);
    }
  }

  // الحصول على جميع المنشورات
  async getAllPosts(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const posts = await Post.findAndCountAll({
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          },
          {
            model: Like,
            as: 'likes',
            include: [{
              model: User,
              as: 'user',
              attributes: ['id', 'name']
            }]
          },
          {
            model: Comment,
            as: 'comments',
            include: [{
              model: User,
              as: 'user',
              attributes: ['id', 'name']
            }],
            order: [['createdAt', 'DESC']],
            limit: 10
          },
          {
            model: Share,
            as: 'shares',
            include: [{
              model: User,
              as: 'user',
              attributes: ['id', 'name']
            }]
          }
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset
      });

      return posts;
    } catch (error) {
      throw new Error(`Error fetching posts: ${error.message}`);
    }
  }

  // الحصول على منشور محدد
  async getPostById(postId) {
    try {
      const post = await Post.findByPk(postId, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          },
          {
            model: Like,
            as: 'likes',
            include: [{
              model: User,
              as: 'user',
              attributes: ['id', 'name']
            }]
          },
          {
            model: Comment,
            as: 'comments',
            include: [{
              model: User,
              as: 'user',
              attributes: ['id', 'name']
            }],
            order: [['createdAt', 'DESC']]
          },
          {
            model: Share,
            as: 'shares',
            include: [{
              model: User,
              as: 'user',
              attributes: ['id', 'name']
            }]
          }
        ]
      });

      if (!post) {
        throw new Error('Post not found');
      }

      return post;
    } catch (error) {
      throw new Error(`Error fetching post: ${error.message}`);
    }
  }
  async updatePost(postId, userId, content, image = undefined) {
    try {
      const post = await Post.findOne({
        where: { id: postId, userId }
      });

      if (!post) {
        throw new Error('المنشور غير موجود أو غير مصرح بالتعديل');
      }

      // حفظ الصورة القديمة لحذفها لاحقاً إذا تم رفع صورة جديدة
      const oldImage = post.image;

      // تحديث البيانات
      const updateData = { content };
      if (image !== undefined) {
        updateData.image = image;
      }

      await post.update(updateData);

      // حذف الصورة القديمة إذا تم رفع صورة جديدة
      if (image !== undefined && oldImage && oldImage !== image) {
        this.deleteImageFile(oldImage);
      }

      // إعادة تحميل المنشور مع العلاقات
      const updatedPost = await Post.findByPk(post.id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          },
          {
            model: Like,
            as: 'likes',
            include: [{
              model: User,
              as: 'user',
              attributes: ['id', 'name']
            }]
          },
          {
            model: Comment,
            as: 'comments',
            include: [{
              model: User,
              as: 'user',
              attributes: ['id', 'name']
            }],
            order: [['createdAt', 'DESC']],
            limit: 10
          },
          {
            model: Share,
            as: 'shares',
            include: [{
              model: User,
              as: 'user',
              attributes: ['id', 'name']
            }]
          }
        ]
      });

      return updatedPost;
    } catch (error) {
      throw new Error(`خطأ في تحديث المنشور: ${error.message}`);
    }
  }

  // دالة مساعدة لحذف ملف الصورة
  deleteImageFile(imagePath) {
    try {
      if (imagePath) {
        const fullPath = path.join(__dirname, '..', imagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          console.log('تم حذف الصورة القديمة:', imagePath);
        }
      }
    } catch (error) {
      console.error('خطأ في حذف الصورة:', error);
    }
  }

  // تحديث دالة الحذف لحذف الصورة أيضاً
  async deletePost(postId, userId) {
    try {
      const post = await Post.findOne({
        where: { id: postId, userId }
      });

      if (!post) {
        throw new Error('المنشور غير موجود أو غير مصرح بالحذف');
      }

      // حذف الصورة المرتبطة إذا وجدت
      if (post.image) {
        this.deleteImageFile(post.image);
      }

      await post.destroy();
      return { message: 'تم حذف المنشور بنجاح' };
    } catch (error) {
      throw new Error(`خطأ في حذف المنشور: ${error.message}`);
    }
  }

  // حذف منشور
  async deletePost(postId) {
    try {
      const post = await Post.findOne({
        where: { id: postId }
      });

      if (!post) {
        throw new Error('Post not found or unauthorized');
      }

      await post.destroy();
      return { message: 'Post deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting post: ${error.message}`);
    }
  }
  
}

module.exports = new PostService();