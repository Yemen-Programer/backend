const WishlistService = require("../services/WishlistService");

class WishlistController {
  async addToWishlist(req, res) {
    try {
      const { userId, contentId } = req.body;

      if (!userId || !contentId) {
        return res.status(400).json({ 
          success: false, 
             message: "يجب تسجيل الدخول"
        });
      }

      const wishlistItem = await WishlistService.addToWishlist(userId, contentId);
      
      return res.status(201).json({ 
        success: true, 
        message: "تمت الإضافة إلى قائمة الأمنيات بنجاح",
        data: { wishlistItem }
      });

    } catch (err) {
      return res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }
  }

  async removeFromWishlist(req, res) {
    try {
      const { userId, contentId } = req.body;

      if (!userId || !contentId) {
        return res.status(400).json({ 
          success: false, 
          message: "معرف المستخدم والمحتوى مطلوبان" 
        });
      }

      const result = await WishlistService.removeFromWishlist(userId, contentId);
      
      return res.status(200).json({ 
        success: true, 
        message: result.message 
      });

    } catch (err) {
      return res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }
  }

  async getUserWishlist(req, res) {
    try {
      const { userId } = req.params;

      const wishlistItems = await WishlistService.getUserWishlist(userId);
      
      return res.status(200).json({ 
        success: true, 
        data: wishlistItems 
      });

    } catch (err) {
      return res.status(500).json({ 
        success: false, 
        message: err.message 
      });
    }
  }

  async checkInWishlist(req, res) {
    try {
      const { userId, contentId } = req.params;

      const inWishlist = await WishlistService.checkInWishlist(userId, contentId);
      
      return res.status(200).json({ 
        success: true, 
        data: { inWishlist } 
      });

    } catch (err) {
      return res.status(500).json({ 
        success: false, 
        message: err.message 
      });
    }
  }

  async getWishlistStatus(req, res) {
    try {
      const { userId } = req.params;
      const { contentIds } = req.body;

      if (!contentIds || !Array.isArray(contentIds)) {
        return res.status(400).json({ 
          success: false, 
          message: "قائمة معرفات المحتوى مطلوبة" 
        });
      }

      const wishlistedContentIds = await WishlistService.getWishlistStatus(userId, contentIds);
      
      return res.status(200).json({ 
        success: true, 
        data: { wishlistedContentIds } 
      });

    } catch (err) {
      return res.status(500).json({ 
        success: false, 
        message: err.message 
      });
    }
  }

  async getWishlistCount(req, res) {
    try {
      const { userId } = req.params;

      const count = await WishlistService.getWishlistCount(userId);
      
      return res.status(200).json({ 
        success: true, 
        data: { count } 
      });

    } catch (err) {
      return res.status(500).json({ 
        success: false, 
        message: err.message 
      });
    }
  }
}

module.exports = new WishlistController();
