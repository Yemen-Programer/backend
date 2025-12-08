const VoteService = require("../services/VoteService");

class VoteController {
  async addVote(req, res) {
    try {
      const { userId, contentId } = req.body;

      if (!userId || !contentId) {
        return res.status(400).json({ 
          success: false, 
          message: "معرف المستخدم والمحتوى مطلوبان" 
        });
      }      
      console.log(userId )
  
      const vote = await VoteService.voteContent(userId, contentId);
      
      // الحصول على عدد التصويتات الجديد
      const votesCount = await VoteService.getContentVotesCount(contentId);
      
      return res.status(201).json({ 
        success: true, 
        message: "تم التصويت بنجاح",
        data: { 
          vote,
          votesCount 
        }
      });

    } catch (err) {
      return res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }
  }

  async getContentVotes(req, res) {
    try {
      const { contentId } = req.params;
      const votesCount = await VoteService.getContentVotesCount(contentId);
      
      return res.status(200).json({ 
        success: true, 
        data: { votesCount } 
      });

    } catch (err) {
      return res.status(500).json({ 
        success: false, 
        message: err.message 
      });
    }
  }

  async checkUserVote(req, res) {
    try {
      const { userId, contentId } = req.params;

      const hasVoted = await VoteService.getUserVoteForContent(userId, contentId);
      
      return res.status(200).json({ 
        success: true, 
        data: { hasVoted } 
      });

    } catch (err) {
      return res.status(500).json({ 
        success: false, 
        message: err.message 
      });
    }
  }

  async getVotesStatus(req, res) {
    try {
      const { userId } = req.params;
      const { contentIds } = req.body;

      if (!contentIds || !Array.isArray(contentIds)) {
        return res.status(400).json({ 
          success: false, 
          message: "قائمة معرفات المحتوى مطلوبة" 
        });
      }

      const votedContentIds = await VoteService.getVotesStatusForContents(userId, contentIds);
      
      return res.status(200).json({ 
        success: true, 
        data: { votedContentIds } 
      });

    } catch (err) {
      return res.status(500).json({ 
        success: false, 
        message: err.message 
      });
    }
  }
}

module.exports = new VoteController();