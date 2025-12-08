// controllers/notificationController.js
const notificationService = require('../services/notificationService');

class NotificationController {
  // الحصول على إشعارات المستخدم
  async getNotifications(req, res) {
    try {
      const { userId } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'معرف المستخدم مطلوب'
        });
      }

      const notifications = await notificationService.getUserNotifications(userId, page, limit);
      
      res.json({
        success: true,
        data: notifications.rows,
        pagination: {
          page,
          limit,
          total: notifications.count,
          pages: Math.ceil(notifications.count / limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // تحديث إشعار كمقروء
  async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'معرف المستخدم مطلوب'
        });
      }

      const notification = await notificationService.markAsRead(id, userId);
      
      res.json({
        success: true,
        data: notification
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  //标记所有通知为已读
  async markAllAsRead(req, res) {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'معرف المستخدم مطلوب'
        });
      }

      const result = await notificationService.markAllAsRead(userId);
      
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

  // الحصول على عدد الإشعارات غير المقروءة
  async getUnreadCount(req, res) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'معرف المستخدم مطلوب'
        });
      }

      const count = await notificationService.getUnreadCount(userId);
      
      res.json({
        success: true,
        data: { count }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new NotificationController();