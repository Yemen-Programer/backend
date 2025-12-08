const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// البحث في المحتوى
router.get('/content', searchController.searchContent);

module.exports = router;