const express = require('express');
const router = express.Router();
const voteController = require('../controllers/VoteController');

// لا حاجة لـ middleware، نرسل userId مباشرة من الفرونت
router.post('/vote', voteController.addVote);
router.get('/votes/content/:contentId', voteController.getContentVotes);
router.get('/votes/check/:userId/:contentId', voteController.checkUserVote);
router.post('/votes/status/:userId', voteController.getVotesStatus);

module.exports = router;