// services/UserService.js
const User = require('../models/User');
const { Op } = require('sequelize');

class UserService {
  // الحصول على جميع المستخدمين
  static async getAllUsers(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    const whereClause = {};

    if (filters.search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${filters.search}%` } },
        { email: { [Op.iLike]: `%${filters.search}%` } }
      ];
    }

    if (filters.role) {
      whereClause.role = filters.role;
    }

    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    return {
      users: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalCount: count
    };
  }

  // الحصول على مستخدم بواسطة ID
  static async getUserById(id) {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      throw new Error('المستخدم غير موجود');
    }

    return user;
  }

  // إنشاء مستخدم جديد
  static async createUser(userData) {
    const { name, email, password, role } = userData;

    // التحقق من عدم وجود مستخدم بنفس البريد
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('البريد الإلكتروني مسجل مسبقاً');
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user'
    });

    // إرجاع البيانات بدون كلمة المرور
    const { password: _, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  // تحديث مستخدم
  static async updateUser(id, userData) {
    const user = await User.findByPk(id);
    
    if (!user) {
      throw new Error('المستخدم غير موجود');
    }

    // إذا تم تغيير البريد، التحقق من عدم تكراره
    if (userData.email && userData.email !== user.email) {
      const existingUser = await User.findOne({ where: { email: userData.email } });
      if (existingUser) {
        throw new Error('البريد الإلكتروني مسجل مسبقاً');
      }
    }

    await user.update(userData);
    
    // إرجاع البيانات بدون كلمة المرور
    const { password: _, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  // حذف مستخدم
  static async deleteUser(id) {
    const user = await User.findByPk(id);
    
    if (!user) {
      throw new Error('المستخدم غير موجود');
    }

    // منع حذف المستخدم إذا كان آخر أدمن
    if (user.role === 'admin') {
      const adminCount = await User.count({ where: { role: 'admin' } });
      if (adminCount === 1) {
        throw new Error('لا يمكن حذف آخر مدير في النظام');
      }
    }

    await user.destroy();
    return { message: 'تم حذف المستخدم بنجاح' };
  }

  // إحصائيات المستخدمين
  static async getUserStats() {
    const stats = await User.findAll({
      attributes: [
        'role',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['role'],
      raw: true
    });

    const totalUsers = await User.count();

    return {
      byRole: stats,
      total: totalUsers
    };
  }
}

module.exports = UserService;