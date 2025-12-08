const Wishlist = require("../models/Wishlist");
const Content = require("../models/Content");
const User = require("../models/User");

class WishlistService {
  async addToWishlist(userId, contentId) {
    // التحقق إذا كان المحتوى مضاف مسبقاً
    const existingWishlist = await Wishlist.findOne({
      where: { userId, contentId }
    });

    if (existingWishlist) {
      throw new Error("هذا المحتوى مضاف مسبقاً إلى قائمة الأمنيات");
    }

    // التحقق من وجود المحتوى
    const content = await Content.findByPk(contentId);
    if (!content) {
      throw new Error("المحتوى غير موجود");
    }

    // التحقق من وجود المستخدم
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("المستخدم غير موجود");
    }

    // إضافة إلى قائمة الأمنيات
    const wishlistItem = await Wishlist.create({
      userId,
      contentId
    });

    return wishlistItem;
  }

  async removeFromWishlist(userId, contentId) {
    const wishlistItem = await Wishlist.findOne({
      where: { userId, contentId }
    });

    if (!wishlistItem) {
      throw new Error("هذا المحتوى غير موجود في قائمة الأمنيات");
    }

    await wishlistItem.destroy();
    return { message: "تم إزالة المحتوى من قائمة الأمنيات" };
  }

  async getUserWishlist(userId) {
    console.log(userId)
    console.log('hi')
    const wishlistItems = await Wishlist.findAll({
      where: { userId },
      include: [{
        model: Content,
        as: 'content',
        attributes: ['id', 'title', 'region', 'image']
      }],
      order: [['createdAt', 'DESC']]
    });

    return wishlistItems;
  }

  async checkInWishlist(userId, contentId) {
    const wishlistItem = await Wishlist.findOne({
      where: { userId, contentId }
    });

    return !!wishlistItem;
  }

  async getWishlistStatus(userId, contentIds) {
    const wishlistItems = await Wishlist.findAll({
      where: {
        userId,
        contentId: contentIds
      },
      attributes: ['contentId']
    });

    const wishlistedContentIds = wishlistItems.map(item => item.contentId.toString());
    return wishlistedContentIds;
  }

  async getWishlistCount(userId) {
    console.log(userId)
    console.log("count")
    const count = await Wishlist.count({
      where: { userId }
    });
    console.log(count)
    return count;
  }
}

module.exports = new WishlistService();