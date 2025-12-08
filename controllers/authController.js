// controllers/authController.js
const { User } = require('../models/associations');

class AuthController {
  // تسجيل مستخدم جديد
  async signup(req, res) {
    try {
      const { name, email, password, confirmPassword } = req.body;

      // التحقق من تطابق كلمات المرور
      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'كلمات المرور غير متطابقة'
        });
      }

      // التحقق من وجود المستخدم مسبقاً
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'البريد الإلكتروني مسجل مسبقاً'
        });
      }

      // إنشاء المستخدم الجديد
      const user = await User.create({
        name,
        email,
        password,
        role: 'user'
      });

      res.status(201).json({
        success: true,
        message: 'تم إنشاء الحساب بنجاح',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        }
      });

    } catch (error) {
      console.error('Signup error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // تسجيل الدخول
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // التحقق من وجود المستخدم
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
        });
      }

      // التحقق من كلمة المرور
      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
        });
      }

      res.json({
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // الحصول على بيانات المستخدم (سيحتاج userId في الـ body)
  async getUser(req, res) {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'معرف المستخدم مطلوب'
        });
      }

      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'المستخدم غير موجود'
        });
      }

      res.json({
        success: true,
        data: user
      });

    } catch (error) {
      console.error('Get user error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // تحديث بيانات المستخدم
  async updateProfile(req, res) {
    try {
      const { userId, name, email } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'معرف المستخدم مطلوب'
        });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'المستخدم غير موجود'
        });
      }

      // التحقق من البريد الإلكتروني إذا تم تغييره
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: 'البريد الإلكتروني مسجل مسبقاً'
          });
        }
      }

      await user.update({
        name: name || user.name,
        email: email || user.email
      });

      res.json({
        success: true,
        message: 'تم تحديث البيانات بنجاح',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // تغيير كلمة المرور
  async changePassword(req, res) {
    try {
      const { userId, currentPassword, newPassword } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'معرف المستخدم مطلوب'
        });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'المستخدم غير موجود'
        });
      }

      // التحقق من كلمة المرور الحالية
      const isValidPassword = await user.validatePassword(currentPassword);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'كلمة المرور الحالية غير صحيحة'
        });
      }

      // تحديث كلمة المرور
      user.password = newPassword;
      await user.save();

      res.json({
        success: true,
        message: 'تم تغيير كلمة المرور بنجاح'
      });

    } catch (error) {
      console.error('Change password error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new AuthController();