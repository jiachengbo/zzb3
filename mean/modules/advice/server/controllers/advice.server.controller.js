'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

/**
 * Create an advice
 */
exports.create = function (req, res) {
  var street_info = sequelize.model('street_info');
  var Advice = sequelize.model('AdviceTable');
  var advice = Advice.build(req.body);

  //advice.user_id = req.user.id;
  advice.save().then(function () {
    //重新加载数据，使数据含有关联表的内容
    return advice.reload({
      include: [
        {
          model: street_info,
          attributes: ['streetName']
        }
      ]
    })
    .then(function() {
      res.json(advice);
    });
  }).catch(function (err) {
    logger.error('advice create error:', err);
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current advice
 */
exports.read = function (req, res) {
  var advice = req.model ? req.model.toJSON() : {};

  //advice.isCurrentUserOwner = !!(req.user && advice.user && advice.user._id.toString() === req.user._id.toString());
  advice.isCurrentUserOwner = !!(req.user && advice.user && advice.user.id.toString() === req.user.id.toString());

  res.json(advice);
};

/**
 * Update an advice
 */
exports.update = function (req, res) {
  var advice = req.model;

  advice.title = req.body.title;
  advice.photo = req.body.photo;
  advice.adviceContent = req.body.adviceContent;
  advice.createDate = req.body.createDate;
  advice.modifyUserId = req.body.modifyUserId;
  advice.releasePerson = req.body.releasePerson;
  advice.replyTime = req.body.replyTime;
  advice.replyContent = req.body.replyContent;
  advice.streetID = req.body.streetID;
  advice.communityID = req.body.communityID;
  advice.gridID = req.body.gridID;

  advice.save().then(function () {
    res.json(advice);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an advice
 */
exports.delete = function (req, res) {
  var advice = req.model;

  advice.destroy().then(function () {
    res.json(advice);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of Advice
 */
exports.list = function (req, res) {
  var Advice = sequelize.model('AdviceTable');
  var street_info = sequelize.model('street_info');

  Advice.findAll({
    include: [
      {
        model: street_info,
        attributes: ['streetName']
      }
    ],
    order: 'id ASC'
  }).then(function (advice) {
    return res.jsonp(advice);
  }).catch(function (err) {
    logger.error('advice list error:', err);
    return res.status(422).send(err);
  });
};

/**
 * Advice middleware
 */
exports.adviceByID = function (req, res, next, id) {
  var Advice = sequelize.model('AdviceTable');
  //var User = sequelize.model('User');

  Advice.findOne({
    where: {id: id}/*,
    include: [
      {
        model: User,
        attributes: ['displayName']
      }
    ]*/
  }).then(function (advice) {
    if (!advice) {
      logger.error('No advice with that identifier has been found');
      return res.status(404).send({
        message: 'No advice with that identifier has been found'
      });
    }

    req.model = advice;
    next();
  }).catch(function (err) {
    //return next(err);
    logger.error('advice ByID error:', err);
    res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};
