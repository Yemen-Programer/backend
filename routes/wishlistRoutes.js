const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/WishlistController');

router.post('/add', wishlistController.addToWishlist);
router.delete('/remove', wishlistController.removeFromWishlist);
router.get('/user/:userId', wishlistController.getUserWishlist);
router.get('/check/:userId/:contentId', wishlistController.checkInWishlist);
router.post('/status/:userId', wishlistController.getWishlistStatus);
router.get('/count/:userId', wishlistController.getWishlistCount);

module.exports = router;