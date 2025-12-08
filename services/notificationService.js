// services/notificationService.js
const { Notification, User, Post } = require('../models/associations');

class NotificationService {
  // الحصول على إشعارات المستخدم
  async getUserNotifications(userId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const notifications = await Notification.findAndCountAll({
        where: { userId },
        include: [
          {
            model: User,
            as: 'targetUser',
            attributes: ['id', 'name']
          },
          {
            model: Post,
            as: 'post',
            attributes: ['id', 'content']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset
      });

      return notifications;
    } catch (error) {
      throw new Error(`Error fetching notifications: ${error.message}`);
    }
  }

  // تحديث حالة الإشعار كمقروء
  async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOne({
        where: { id: notificationId, userId }
      });

      if (!notification) {
        throw new Error('Notification not found');
      }

      notification.read = true;
      await notification.save();

      return notification;
    } catch (error) {
      throw new Error(`Error marking notification as read: ${error.message}`);
    }
  }

  async markAllAsRead(userId) {
    try {
      await Notification.update(
        { read: true },
        { where: { userId, read: false } }
      );

      return { message: 'All notifications marked as read' };
    } catch (error) {
      throw new Error(`Error marking all notifications as read: ${error.message}`);
    }
  }

  // الحصول على عدد الإشعارات غير المقروءة
  async getUnreadCount(userId) {
    try {
      const count = await Notification.count({
        where: { userId, read: false }
      });

      return count;
    } catch (error) {
      throw new Error(`Error counting unread notifications: ${error.message}`);
    }
  }
}

module.exports = new NotificationService();