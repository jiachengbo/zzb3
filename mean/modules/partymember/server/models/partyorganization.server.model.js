'use strict';

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
        defaultValue: '',
        comment: '党组织名称'
      },
      OrganizationTime: {
        type: DataTypes.DATE,
        comment: '成立时间'
      },
      Secretary: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '书记'
      },
      Head: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '党务专干'
      },
      OrganizationNum: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '党员人数'
      },
      Category: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '单位类别'
      },
      Relations: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '隶属关系'
      },
      Superior: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '上级党组织'
      },
      OrganizationCategory: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '组织类别'
      },
      Address: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '联系地址'
      },
      TelNumber: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '联系电话'
      },
      BelongGrid: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '所属网格编号'
      },
      isdelete: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '是否删除'
      },
      createUserId: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '创建人ID'
      },
      createDate: {
        type: DataTypes.DATE,
        comment: '创建时间'
      },
      modifyUserId: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '修改人ID'
      },
      modifyDate: {
        type: DataTypes.DATE,
        comment: '修改时间'
      },
      communityId: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '所属社区ID'
      },
      streetID: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '所属街道'
      },
      longitude: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '经度'
      },
      latitude: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '维度'
      },
      isPhoneDJ: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '是否手机创建'
      },
      branchName: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: 'branchName'
      },
      simpleName: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: 'simpleName'
      },
      generalbranch: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'generalbranch'
      },
      commintId: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '所属社区int'
      },
      super: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'super'
      },
      mold: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'mold'
      },
      branchType: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: 'branchType'
      },
      unitsitu: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: 'unitsitu'
      },
      unitname: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: 'unitname'
      },
      unitorgsitu: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: 'unitorgsitu'
      },
      unitcode: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: 'unitcode'
      }
    },
    {
      comment: '区党组织表',
      classMethods: {
        associate: function (models) {
          this.hasMany(models.dj_PartyMember,
            {foreignKey: 'branch', targetKey: 'OrganizationId'});
        }
      }
    }
  );

  return dj_PartyBranch;
};
