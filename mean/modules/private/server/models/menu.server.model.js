"use strict";var path=require("path"),dbExtend=require(path.resolve("./config/lib/dbextend"));module.exports=function(e,t){return e.define("Menu",{id:{type:t.INTEGER,autoIncrement:!0,primaryKey:!0,allowNull:!1},state:{type:t.STRING(200),defaultValue:"",comment:"路由"},roles:{type:t.STRING(513),defaultValue:"",comment:"权限数组"},title:{type:t.STRING(200),defaultValue:"",comment:"标题"},shortTitle:{type:t.STRING(10),defaultValue:"",comment:"短标题"},icon:{type:t.STRING(500),defaultValue:"",comment:"图标"},iconSelected:{type:t.STRING(500),defaultValue:"",comment:"选择后的图标"},imgUrl:{type:t.STRING(500),defaultValue:"",comment:"图像"},imgUrlSelected:{type:t.STRING(500),defaultValue:"",comment:"选择后的图像"},noteText:{type:t.STRING,defaultValue:"",comment:"备注"},parentId:{type:t.INTEGER,defaultValue:0}},{comment:"菜单表",tableName:"menuinfo",getterMethods:{roles:dbExtend.getterMethodArray},setterMethods:{roles:dbExtend.setterMethodArray},instanceMethods:{},classMethods:{associate:function(e){}}})};