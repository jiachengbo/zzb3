'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  dbtools = require(path.resolve('./config/private/dbtools')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

var User = sequelize.model('User');
var Department = sequelize.model('Department');
var Role = sequelize.model('Role');
var WorkPosition = sequelize.model('WorkPosition');

/**
 * Create an workposition
 */
exports.create = function (req, res) {
  req.body.displayName = User.genDisplayName(req.body.firstName, req.body.lastName);

  var user = User.build(req.body);
  user.save()
    .then(function () {
      //保存workposition关联
      if (req.body.wps && Array.isArray(req.body.wps)) {
        //增加返回workpositions字段
        user.set('wps', req.body.wps, {raw: true});
        var workpositions = req.body.wps.map(function (workposition) {
          return WorkPosition.build(workposition);
        });
        return user.setWps(workpositions);
      }
    })
    .then(function() {
      res.json(user);
    })
    .catch(function (err) {
      logger.error('admin user create error:', err);
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};

/**
 * Show the current user
 */
exports.read = function (req, res) {
  res.json(req.model);
};

/**
 * Update a User
 */
exports.update = function (req, res) {
  var user = req.model;
  req.body.displayName = User.genDisplayName(req.body.firstName, req.body.lastName);

  //model.build 不会将非表字段加入实例，而instance.update会将所有参数加入实例
  //如果使用了update(req.body),没有使用save,就不需要再调用user.set('wps', req.body.wps, {raw: true})设置新关联内容了
  user.update(req.body)
    .then(function () {
      if (req.body.wps && Array.isArray(req.body.wps)) {
        var workpositions = req.body.wps.map(function (workposition) {
          return WorkPosition.build(workposition);
        });
        return user.setWps(workpositions);
      }
    })
    .then(function () {
      res.json(user);
    }).catch(function (err) {
      logger.error('admin user update error:', err);
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};

/**
 * Delete a user
 */
exports.delete = function (req, res) {
  var user = req.model;

  user.destroy()
    .then(function () {
      //清除和workposition的关联
      return user.setWps([]);
    })
    .then(function () {
      res.json(user);
    }).catch(function (err) {
      logger.error('admin user delete error:', err);
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};

/**
 * List of Users
 */
exports.list = function (req, res) {
  User.findAll({
    attributes: {exclude: ['password', 'salt', 'providerData',
      'additionalProvidersData', 'resetPasswordToken', 'resetPasswordExpires']},
    include: [
      {
        model: WorkPosition,
        as: 'wps',  //此处别名必须和定义中相同
        through: {
          as: 'wpu', //定义中间表别名
          attributes: []
        },
        attributes: ['id', 'name']
      }
    ],
    order: 'createdAt DESC'
  }).then(function (users) {
    res.json(users);
  }).catch(function (err) {
    logger.error('admin user list error:', err);
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  User.findOne({
    where: {id: id},
    include: [
      {
        model: WorkPosition,
        as: 'wps',
        through: {
          as: 'wpu',
          attributes: []
        },
        attributes: ['id', 'name']
      }
    ],
    attributes: {exclude: ['salt', 'password', 'providerData']}
  }).then(function (user) {
    if (!user) {
      logger.error('admin user userbyid find null error id=', id);
      return next(new Error('Failed to load user ' + id));
    }
    req.model = user;
    next();
  }).catch(function (err) {
    logger.error('admin user userbyid error:', err);
    return next(err);
  });
};
