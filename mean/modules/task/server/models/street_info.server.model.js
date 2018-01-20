'use strict';

module.exports = function (sequelize, DataTypes) {

  var street_info = sequelize.define('street_info',
    {
      streetID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      streetName: {
        type: DataTypes.STRING,
        comment: '街道名称'
      }
    },
    {
      comment: 'street_info table'
    }
  );
  return street_info;
};
