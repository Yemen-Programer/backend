// models/Share.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Share = sequelize.define('Share', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sharedContent: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'shares',
  timestamps: true
});

module.exports = Share;