"use strict";var path=require("path"),errorHandler=require(path.resolve("./modules/core/server/controllers/errors.server.controller")),sequelize=require(path.resolve("./config/lib/sequelize")),logger=require(path.resolve("./config/lib/logger")).getLogger_FileNameBase(__filename);exports.create=function(e,r){var n=sequelize.model("Menu"),o=n.build(e.body);o.save().then(function(){r.json(o)}).catch(function(e){return logger.error("menu create error:",e),r.status(422).send({message:errorHandler.getErrorMessage(e)})})},exports.read=function(e,r){var n=e.model?e.model.toJSON():{};r.json(n)},exports.update=function(e,r){var n=e.model;n=Object.assign(n,e.body),n.save().then(function(){r.json(n)}).catch(function(e){return r.status(422).send({message:errorHandler.getErrorMessage(e)})})},exports.delete=function(e,r){var n=e.model;n.destroy().then(function(){}).then(function(){r.json(n)}).catch(function(e){return logger.error("delete menu error:",e),r.status(422).send({message:errorHandler.getErrorMessage(e)})})},exports.list=function(e,r){sequelize.model("Menu").findAll({order:"id ASC"}).then(function(e){return r.jsonp(e)}).catch(function(e){return logger.error("menu list error:",e),r.status(422).send(e)})},exports.menuByID=function(e,r,n,o){sequelize.model("Menu").findOne({where:{id:o}}).then(function(o){if(!o)return logger.error("findone menuByID return null error"),r.status(404).send({message:"No menu with that identifier has been found"});e.model=o,n()}).catch(function(e){return logger.error("fineone menuByID error:",e),n(e)})};