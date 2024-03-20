'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class priductss extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  priductss.init({
    name: DataTypes.STRING,
    desc: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'priductss',
  });
  return priductss;
};