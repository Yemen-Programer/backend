// models/Chat.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Chat = sequelize.define('Chat', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sessionId: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  messageCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastMessage: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'chats',
  timestamps: true
});

module.exports = Chat;