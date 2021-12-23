const { Model, DataTypes, INTEGER, STRING } = require('sequelize');

const sequelize = require('../config/connection.js');

class Tag extends Model {}

Tag.init(
  {
    id: {
      type: INTEGER,
      allowNull: false, 
      primaryKey: true, 
      autoIncrement: true
    },
    tag_name: {
      type: STRING
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'tag',
  }
);

module.exports = Tag;