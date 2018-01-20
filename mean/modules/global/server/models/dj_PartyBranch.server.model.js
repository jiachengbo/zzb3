'use strict';
var path = require('path'),
  dbExtend = require(path.resolve('./config/lib/dbextend'));
module.exports = function (sequelize, DataTypes) {

  var dj_PartyBranch = sequelize.define('dj_PartyBranch',
    {
      OrganizationId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      OrganizationName: {
        type: DataTypes.STRING,
        comment: '党组织名称'
      },
      simpleName: {
        type: DataTypes.STRING,
        comment: '党支部简称'
      },
      generalbranch: {
        type: DataTypes.INTEGER,
        comment: '上级总支'
      },
      super: {
        type: DataTypes.INTEGER,
        comment: '上级党组织'
      },
      GradeID: {
        type: DataTypes.INTEGER,
        comment: '层级ID'
      },
      mold: {
        type: DataTypes.INTEGER,
        comment: '组织类别'
      },
      OrganizationTime: {
        type: DataTypes.DATE,
        comment: '成立时间'
      },
      Secretary: {
        type: DataTypes.STRING,
        comment: '书记'
      },
      Head: {
        type: DataTypes.STRING,
        comment: '党务专干'
      },
      OrganizationNum: {
        type: DataTypes.STRING,
        comment: '人数'
      },
      TelNumber: {
        type: DataTypes.STRING,
        comment: '电话号码'
      },
      longitude: {
        type: DataTypes.FLOAT,
        comment: '经度'
      },
      latitude: {
        type: DataTypes.FLOAT,
        comment: '纬度'
      },
      streetID: {
        type: DataTypes.INTEGER,
        comment: '街道ID'
      },
      communityId: {
        type: DataTypes.STRING,
        comment: '社区ID'
      },
      BelongGrid: {
        type: DataTypes.STRING,
        comment: '网格ID'
      },
      belongComm: {
        type: DataTypes.INTEGER,
        comment: '是否属于社区'
      }
    },
    {
      comment: '党工委、党委党支部信息表'
    }
  );
  dbExtend.addBaseCode('dj_PartyBranch', {
    attributes: ['OrganizationId', 'belongComm', 'GradeID', 'OrganizationName', 'simpleName', 'simpleName', 'generalbranch', 'super', 'mold', 'latitude', 'longitude', 'TelNumber', 'OrganizationNum', 'Head', 'Secretary', 'OrganizationTime', 'communityId', 'streetID', 'BelongGrid']
  });
  return dj_PartyBranch;
};
