'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

/**
 * Module init function.
 */
module.exports = function (app, sequelize) {

  //创建自己的表
  // var Teammembers = sequelize.model('Teammembers');
  // Teammembers.sync({
  //   force: true,
  //   loging: true
  // })
  // .then(function () {
  //   logger.info('Database table Teammembers synchronized OK!');
  // }).catch(function (err) {
  //   logger.error('Database table Teammembers synchronized error: ', err);
  //   throw err;
  // });
};
