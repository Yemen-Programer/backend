// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const upload = require('../middleware/upload'); 

// routes for posts
router.post('/', upload.single('image'), postController.createPost);
router.get('/', postController.getPosts);
router.get('/:id', postController.getPost);
router.put('/:id', upload.single('image'), postController.updatePost); // إضافة route التحديث
router.delete('/:id', postController.deletePost);

// routes for interactions
router.post('/:postId/like', postController.likePost);
router.post('/:postId/comment', postController.commentOnPost);
router.post('/:postId/share', postController.sharePost);
router.get('/:postId/comments', postController.getPostComments);

module.exports = router;