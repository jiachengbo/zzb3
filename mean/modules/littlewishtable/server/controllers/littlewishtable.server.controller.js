'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  uuid = require('uuid'),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

/**
 * Create an littleWishTable
 */
exports.create = function (req, res) {
  var LittleWishTable = sequelize.model('LittleWishTable');
  var littleWishTable = LittleWishTable.build(req.body);
  littleWishTable.littleId = uuid.v4().replace(/-/g, '');
  // 添加用户的 gradeId roleId PartyBranchID
  var user = req.user;
  littleWishTable.gradeId = parseInt(user.user_grade, 0);
  littleWishTable.roleId = parseInt(user.JCDJ_User_roleID, 0);
  littleWishTable.PartyBranchID = parseInt(user.branch, 0);
  littleWishTable.super = req.body.super;
  littleWishTable.streetID = req.body.streetID;
  littleWishTable.communityID = req.body.communityID;
  littleWishTable.grid = req.body.grid;
  littleWishTable.save().then(function () {
    //重新加载数据，使数据含有关联表的内容
    return littleWishTable.reload()
      .then(function () {
        res.json(littleWishTable);
      });
  }).catch(function (err) {
    logger.error('littleWishTable create error:', err);
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current littleWishTable
 */
exports.read = function (req, res) {
  var littleWishTable = req.model ? req.model.toJSON() : {};
  littleWishTable.isCurrentUserOwner = !!(req.user && littleWishTable.user && littleWishTable.user.id.toString() === req.user.id.toString());

  res.json(littleWishTable);
};

/**
 * Update an littleWishTable
 */
exports.update = function (req, res) {
  var littleWishTable = req.model;
  littleWishTable.littleId = req.body.littleId;
  littleWishTable.littleTitle = req.body.littleTitle;
  littleWishTable.littleContent = req.body.littleContent;
  littleWishTable.littleDate = req.body.littleDate;
  littleWishTable.littlePerson = req.body.littlePerson;
  littleWishTable.littleClaimant = req.body.littleClaimant;
  littleWishTable.littleClaimDate = req.body.littleClaimDate;
  littleWishTable.littleStatus = req.body.littleStatus;
  littleWishTable.nPassReason = req.body.nPassReason;
  littleWishTable.littleNum = req.body.littleNum;
  littleWishTable.isdelete = req.body.isdelete;
  littleWishTable.createUserId = req.body.createUserId;
  littleWishTable.createDate = req.body.createDate;
  littleWishTable.modifyUserId = req.body.modifyUserId;
  littleWishTable.modifyDate = req.body.modifyDate;
  // littleWishTable.littlePhoto = req.body.littlePhoto;
  littleWishTable.littltCon = req.body.littltCon;
  littleWishTable.issend = req.body.issend;
  littleWishTable.tx = req.body.tx;
  littleWishTable.ClaimTime = req.body.ClaimTime;
  // littleWishTable.isPhoneDJ = req.body.isPhoneDJ;
  littleWishTable.PartyBranchID = req.body.PartyBranchID;
  littleWishTable.sbphone = req.body.sbphone;
  littleWishTable.claimphone = req.body.claimphone;

  littleWishTable.save().then(function () {
    res.json(littleWishTable);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an littleWishTable
 */
exports.delete = function (req, res) {
  var littleWishTable = req.model;

  littleWishTable.destroy().then(function () {
    res.json(littleWishTable);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of LittleWishTable
 */
exports.list = function (req, res) {
  var LittleWishTable = sequelize.model('LittleWishTable');
  var limit = parseInt(req.query.limit, 0);//(pageNum-1)*20
  var offset = parseInt(req.query.offset, 0);//20 每页总数
  var gradeId = parseInt(req.user.user_grade, 0);//gradeId
  var roleId = parseInt(req.user.JCDJ_User_roleID, 0);//roleId
  var branchId = parseInt(req.user.branch, 0);//branchId
  var _super = parseInt(req.query._super, 0);//_super
  var littleStatus = req.query.littleStatus;//littleStatus
  var OrganizationIds = req.query.OrganizationIds;//OrganizationIds
  var OrgIds = [];
  var cont = req.query.cont;
  var sum = req.query.sum;
  if (gradeId === 10 || gradeId === 9) {
    if (OrganizationIds) {
      OrganizationIds.forEach(function (value, index, array) {
        OrgIds.push(Number(value));
      });
    }
  }
  if (sum) {
    listByPage(req, res, limit, offset, littleStatus, gradeId, roleId, branchId, _super, OrgIds);
  } else if (cont) {
    listCount(req, res, littleStatus, gradeId, roleId, branchId, _super, OrgIds);
  } else {
    LittleWishTable.findAll({
      order: 'littleId desc'
    }).then(function (littleWishTable) {
      return res.jsonp(littleWishTable);
    }).catch(function (err) {
      logger.error('littleWishTable list error:', err);
      return res.status(422).send(err);
    });
  }

};

//----分页
function listByPage(req, res, limit, offset, littleStatus, gradeId, roleId, branchId, _super, OrgIds) {
  littleStatus = littleStatus + '';
  // var LittleWishTable = sequelize.model('LittleWishTable');
  /*
   var sql = 'select * from ( select p.*, rownum rnum from ' +
   '(select row_number() over(order by id desc) as rownum, ' +
   '* from LittleWishTable where littleStatus = \'' + littleStatus + '\') p ' +
   ' where rownum <= ' + offset + ') z where rnum > ' + limit;
   sequelize.query(sql, {type: sequelize.QueryTypes.SELECT}).then(function (infos) {
   res.jsonp(infos);
   }).catch(function (err) {
   logger.error('LittleWishTable list error:', err);
   return res.status(422).send(err);
   });
   */

  var opt = {
    littleStatus: littleStatus
  };
  var superOpt = {
    super: _super,
    littleStatus: littleStatus
  };
  if (gradeId === 1) {
    opt = {
      littleStatus: littleStatus
    };
  }
  if (gradeId === 2) {
    opt = {
      $or: [
        {gradeId: 2},
        {gradeId: 4}
      ],
      littleStatus: littleStatus
    };
    superOpt = {
      $or: [
        {super: {$between: [13, 30]}}
      ]
    };
  }
  if (gradeId === 3) {
    opt = {
      $or: [
        {gradeId: 3},
        {gradeId: 5}
      ],
      littleStatus: littleStatus
    };
    superOpt = {
      $or: [
        {super: {$between: [1, 12]}}
      ]
    };
  }
  if (gradeId === 5 || gradeId === 4) {
    opt = {
      gradeId: gradeId,
      roleId: roleId,
      littleStatus: littleStatus
    };
  }
  if (gradeId === 7 || gradeId === 6) {
    opt = {
      gradeId: gradeId,
      PartyBranchID: branchId,
      littleStatus: littleStatus
    };
  }
  // 党总支
  if (gradeId === 9 || gradeId === 10) {
    if (gradeId === 9) {
      opt = {
        gradeId: [9, 6],
        PartyBranchID: OrgIds,
        littleStatus: littleStatus
      };
    } else {
      opt = {
        gradeId: [7, 10],
        PartyBranchID: OrgIds,
        littleStatus: littleStatus
      };
    }
    superOpt = {};
  }
  var LittleWishTable = sequelize.model('LittleWishTable');
  LittleWishTable.findAll({
    where: {
      $or: [
        opt,
        superOpt
      ]
    },
    limit: offset,
    offset: limit,
    order: 'id desc'
  }).then(function (littleWishTable) {
    return res.jsonp(littleWishTable);
  }).catch(function (err) {
    logger.error('littleWishTable list error:', err);
    return res.status(422).send(err);
  });

}
//---------总数
function listCount(req, res, littleStatus, gradeId, roleId, branchId, _super, OrgIds) {
  var tjSql = '';
  if (gradeId === 1) {
    tjSql = '';
  }
  if (gradeId === 2) {
    tjSql = ' and  gradeId = 4 or gradeId = 2 or 13 <=super and super <= 30';
  }
  if (gradeId === 3) {
    tjSql = ' and  gradeId = 5 or gradeId = 3 or super <= 12 and gradeId !=2';
  }
  if (gradeId === 5 || gradeId === 4) {
    tjSql = ' and  gradeId = ' + gradeId + ' and roleId = ' + roleId + ' or super = ' + _super + ' and littleStatus = ' + '\'' + littleStatus + '\'';
  }
  // 党工委党支部 党委党支部
  if (gradeId === 7 || gradeId === 6) {
    tjSql = ' and  gradeId = ' + gradeId + ' and PartyBranchID = ' + branchId;
  }
  // 党总支
  if (gradeId === 9 || gradeId === 10) {
    //var OrgIdsSql = ' or (gradeId = ' + gradeId + ' and PartyBranchID in (' + OrgIds + '))';
    if (gradeId === 9) {
      gradeId = [6, 9];
    } else {
      gradeId = [7, 10];
    }
    tjSql = ' and  gradeId in (' + gradeId + ') and PartyBranchID in (' + OrgIds + ')';
  }
  var sql = 'select count(*) sum from LittleWishTable where littleStatus = ' + '\'' + littleStatus + '\'' + tjSql;
  sequelize.query(sql, {type: sequelize.QueryTypes.SELECT}).then(function (infos) {
    res.jsonp(infos);
  }).catch(function (err) {
    logger.error('listCount error:', err);
    return res.status(422).send(err);
  });
}
/**
 * LittleWishTable middleware
 */
exports.littleWishTableByID = function (req, res, next, id) {
  var LittleWishTable = sequelize.model('LittleWishTable');
  /*var limit = parseInt(req.query.limit, 0);//(pageNum-1)*20
   var offset = parseInt(req.query.offset, 0);//20 每页总数
   var gradeId = parseInt(req.user.user_grade, 0);//gradeId
   var roleId = parseInt(req.user.JCDJ_User_roleID, 0);//roleId
   var branchId = parseInt(req.user.branch, 0);//branchId
   var _super = parseInt(req.query._super, 0);//_super
   var littleStatus = req.query.littleStatus;//littleStatus
   var OrganizationIds = req.query.OrganizationIds;//OrganizationIds
   var OrgIds = [];
   if (gradeId === 10 || gradeId === 9) {
   if (OrganizationIds) {
   OrganizationIds.forEach(function (value, index, array) {
   OrgIds.push(Number(value));
   });
   }
   }
   // console.info('OrgIds', OrgIds);
   if (offset !== 0 && id === '0') {
   listByPage(req, res, limit, offset, littleStatus, gradeId, roleId, branchId, _super, OrgIds);
   } else if (limit === 0 && offset === 0 && id === '0') {
   listCount(req, res, littleStatus, gradeId, roleId, branchId, _super, OrgIds);
   } else if (id !== '0') {*/
  LittleWishTable.findOne({
    where: {id: id}
  }).then(function (littleWishTable) {
    if (!littleWishTable) {
      logger.error('No littleWishTable with that identifier has been found');
      return res.status(404).send({
        message: 'No littleWishTable with that identifier has been found'
      });
    }
    req.model = littleWishTable;
    next();
  }).catch(function (err) {
    logger.error('littleWishTable ByID error:', err);
    res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
  // }
};
