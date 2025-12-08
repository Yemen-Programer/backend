// models/Comment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'محتوى التعليق مطلوب' }
    }
  }
}, {
  tableName: 'comments',
  timestamps: true
});

module.exports = Comment;