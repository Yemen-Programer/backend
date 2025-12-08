const express = require("express");
const router = express.Router();
const ContentController = require("../controllers/ContentController");
const { validateContent, validateContentUpdate } = require("../middleware/validation");
const upload = require("../middleware/upload");

// GET جميع المحتويات
router.get("/", ContentController.getContent);

// GET محتوى حسب المنطقة
router.get("/region/:region", ContentController.getRegionContent);

// GET محتوى بواسطة ID (أضفت هذه)
router.get("/:id", ContentController.getContentById);

// POST إنشاء محتوى جديد
router.post(
  "/",
  upload.any(),
  ContentController.createContent
);

// PUT تحديث محتوى
router.put(
  "/:id",
  upload.any(),
  ContentController.updateContent
);

// DELETE حذف محتوى
router.delete("/:id", ContentController.deleteContent);

module.exports = router;