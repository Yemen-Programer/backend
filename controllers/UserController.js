// controllers/UserController.js
const UserService = require('../services/UserService');

class UserController {
  // GET جميع المستخدمين
  static async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 10, search, role } = req.query;
      const filters = { search, role };
      
      const result = await UserService.getAllUsers(page, limit, filters);
      res.json({
        success: true,
        data: result.users,
        pagination: {
          currentPage: result.currentPage,
          totalPages: result.totalPages,
          totalCount: result.totalCount
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET مستخدم بواسطة ID
  static async getUserById(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id);
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // POST إنشاء مستخدم جديد
  static async createUser(req, res) {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json({
        success: true,
        message: 'تم إنشاء المستخدم بنجاح',
        data: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // PUT تحديث مستخدم
  static async updateUser(req, res) {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      res.json({
        success: true,
        message: 'تم تحديث المستخدم بنجاح',
        data: user
      });
    } catch (error) {
        console.log(error)
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // DELETE حذف مستخدم
  static async deleteUser(req, res) {
    try {
      const result = await UserService.deleteUser(req.params.id);
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET إحصائيات المستخدمين
  static async getUserStats(req, res) {
    try {
      const stats = await UserService.getUserStats();
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = UserController;