const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Content = sequelize.define("Content", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  title: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  description: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  type: { 
    type: DataTypes.ENUM(
      'heritage',
      'intangible-oral',
      'intangible-crafts', 
      'intangible-folklore',
      'clothing-men',
      'clothing-women',
      'clothing-boys',
      'clothing-girls',
      'food'
    ),
    allowNull: false 
  },
  region: { 
    type: DataTypes.ENUM(
      'northern',
      'eastern', 
      'central',
      'western',
      'southern'
    ),
    allowNull: false 
  },
  image: { 
    type: DataTypes.STRING 
  },
  model3d: {
    type: DataTypes.STRING 
  },
  googlemapsurl: {
    type: DataTypes.TEXT 
  },
  coordinates: {
    type: DataTypes.STRING 
  },
  votesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'contents',
  timestamps: true
});

module.exports = Content;