'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

/**
 * Create an problem
 */
exports.create = function (req, res) {
  //var User = sequelize.model('User');
  var Problem = sequelize.model('Problem');
  var problem = Problem.build(req.body);

  //problem.user_id = req.user.id;
  problem.save().then(function () {
    //重新加载数据，使数据含有关联表的内容
    return problem.reload({
      /*include: [
        {
          model: User,
          attributes: ['displayName']
        }
      ]*/
    })
    .then(function() {
      res.json(problem);
    });
  }).catch(function (err) {
    logger.error('problem create error:', err);
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current problem
 */
exports.read = function (req, res) {
  var problem = req.model ? req.model.toJSON() : {};

  //problem.isCurrentUserOwner = !!(req.user && problem.user && problem.user._id.toString() === req.user._id.toString());
  problem.isCurrentUserOwner = !!(req.user && problem.user && problem.user.id.toString() === req.user.id.toString());

  res.json(problem);
};

/**
 * Update an problem
 */
exports.update = function (req, res) {
  var problem = req.model;

  problem.title = req.body.title;
  problem.content = req.body.content;

  problem.save().then(function () {
    res.json(problem);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an problem
 */
exports.delete = function (req, res) {
  var problem = req.model;

  problem.destroy().then(function () {
    res.json(problem);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of Problem
 */
exports.list = function (req, res) {
  var Problem = sequelize.model('Problem');
 // var User = sequelize.model('User');

  Problem.findAll({
    /*include: [
      {
        model: User,
        attributes: ['displayName']
      }
    ],*/
    order: 'id ASC'
  }).then(function (problem) {
    return res.jsonp(problem);
  }).catch(function (err) {
    logger.error('problem list error:', err);
    return res.status(422).send(err);
  });
};

/**
 * Problem middleware
 */
exports.problemByID = function (req, res, next, id) {
  var Problem = sequelize.model('Problem');
  //var User = sequelize.model('User');

  Problem.findOne({
    where: {id: id},
    /*include: [
      {
        model: User,
        attributes: ['displayName']
      }
    ]*/
  }).then(function (problem) {
    if (!problem) {
      logger.error('No problem with that identifier has been found');
      return res.status(404).send({
        message: 'No problem with that identifier has been found'
      });
    }

    req.model = problem;
    next();
  }).catch(function (err) {
    //return next(err);
    logger.error('problem ByID error:', err);
    res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};
