// routes/users.js
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

// GET جميع المستخدمين
router.get("/", UserController.getAllUsers);

// GET إحصائيات المستخدمين
router.get("/stats", UserController.getUserStats);

// GET مستخدم بواسطة ID
router.get("/:id", UserController.getUserById);

// POST إنشاء مستخدم جديد
router.post("/", UserController.createUser);

// PUT تحديث مستخدم
router.put("/:id", UserController.updateUser);

// DELETE حذف مستخدم
router.delete("/:id", UserController.deleteUser);

module.exports = router;