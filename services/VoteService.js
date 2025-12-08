const Vote = require("../models/Vote");
const Content = require("../models/Content");

class VoteService {
  async voteContent(userId, contentId) {
    // التحقق إذا كان المستخدم صوت مسبقاً
    const existingVote = await Vote.findOne({
      where: { userId, contentId }
    });

    if (existingVote) {
      throw new Error("لقد قمت بالتصويت لهذا المحتوى مسبقاً");
    }

    // التحقق من وجود المحتوى
    const content = await Content.findByPk(contentId);
    if (!content) {
      throw new Error("المحتوى غير موجود");
    }

    // استخدام transaction لضمان تكامل البيانات
    const transaction = await Vote.sequelize.transaction();
    
    try {
      // إنشاء التصويت
      const vote = await Vote.create({
        userId,
        contentId
      }, { transaction });

      // زيادة votesCount في المحتوى
      await Content.update(
        { 
        votesCount: Number(content.votesCount || 0) + 1

        },
        { 
          where: { id: contentId },
          transaction 
        }
      );

      // commit العملية
      await transaction.commit();

      return vote;

    } catch (error) {
      // rollback في حالة الخطأ
      await transaction.rollback();
      throw error;
    }
  }

  async removeVote(userId, contentId) {
    const transaction = await Vote.sequelize.transaction();
    
    try {
      // البحث عن التصويت
      const vote = await Vote.findOne({
        where: { userId, contentId }
      });

      if (!vote) {
        throw new Error("لم تقم بالتصويت لهذا المحتوى");
      }

      // الحصول على المحتوى
      const content = await Content.findByPk(contentId);
      if (!content) {
        throw new Error("المحتوى غير موجود");
      }

      // حذف التصويت
      await Vote.destroy({
        where: { userId, contentId },
        transaction
      });

      // تقليل votesCount في المحتوى
      await Content.update(
        { 
          votesCount: Math.max(0, (content.votesCount || 1) - 1) 
        },
        { 
          where: { id: contentId },
          transaction 
        }
      );

      await transaction.commit();

      return { message: "تم إلغاء التصويت بنجاح" };

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getContentVotesCount(contentId) {
    const count = await Vote.count({
      where: { contentId }
    });

    return count;
  }

  async getUserVoteForContent(userId, contentId) {
    const vote = await Vote.findOne({
      where: { userId, contentId }
    });

    return !!vote;
  }

  async getVotesStatusForContents(userId, contentIds) {
    const votes = await Vote.findAll({
      where: {
        userId,
        contentId: contentIds
      },
      attributes: ['contentId']
    });

    const votedContentIds = votes.map(vote => vote.contentId.toString());
    return votedContentIds;
  }

  // دالة جديدة للحصول على المحتويات الأكثر تصويتاً
  async getTopVotedContents(limit = 10) {
    const contents = await Content.findAll({
      attributes: ['id', 'title', 'type', 'region', 'votesCount', 'image'],
      order: [['votesCount', 'DESC']],
      limit: limit
    });

    return contents;
  }

  // دالة لمزامنة votesCount مع التصويتات الفعلية (للتأكد من دقة البيانات)
  async syncVotesCount() {
    const transaction = await Vote.sequelize.transaction();
    
    try {
      // الحصول على جميع المحتويات
      const contents = await Content.findAll({ transaction });
      
      for (const content of contents) {
        // حساب التصويتات الفعلية
        const actualVotesCount = await Vote.count({
          where: { contentId: content.id },
          transaction
        });

        // تحديث votesCount إذا كان مختلفاً
        if (content.votesCount !== actualVotesCount) {
          await Content.update(
            { votesCount: actualVotesCount },
            { 
              where: { id: content.id },
              transaction 
            }
          );
          console.log(`تم مزامنة المحتوى ${content.id}: ${content.votesCount} -> ${actualVotesCount}`);
        }
      }

      await transaction.commit();
      return { message: "تم مزامنة عدد التصويتات بنجاح" };

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = new VoteService();