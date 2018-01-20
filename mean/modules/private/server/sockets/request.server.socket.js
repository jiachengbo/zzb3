"use strict";function Request(e,t,r){EventEmitter.call(this),this.socket=e,this.msgcode=t,this.options="object"==typeof r&&r||{}}var path=require("path"),EventEmitter=require("events"),RESULT=require(path.resolve("./modules/private/server/sockets/const.server.socket")).RESULT,logger=require(path.resolve("./config/lib/logger")).getLogger("socketio.request");Request.prototype=Object.create(EventEmitter.prototype),module.exports=Request,Request.prototype.REQEND="REQEND",Request.prototype.REQERROR="REQERROR",Request.prototype.buildDefReq=function(){return{id:-1,reqid:"no",first_time:new Date,attempttimes:1,msgrecv:null,lastrecv_time:new Date,msgsend:null,lastsend_time:null}},Request.prototype.updateReqPacket=function(e,t){return e},Request.prototype.listen=function(e){},Request.prototype.stopListen=function(){},Request.prototype.sendRespon=function(e,t){this.options.respon&&logger.error("REQUEST %s need respon, but sendRespon not complete",this.msgcode)},Request.prototype.recvRequest=function(e){return Promise.resolve(RESULT.GOOD)},Request.prototype.recvRequestCallBack=function(){var e=this.buildDefReq(),t=Array.from(arguments);t.unshift(e);var r=this.updateReqPacket.apply(this,t);if("string"==typeof r)return this.sendRespon.apply(this,[new Error(r)].concat(t)),e.result=RESULT.ERROR,e.msgsend={data:e.msgsend,error:r},void this.emit(this.REQERROR,e);var o=this,s=setTimeout(function(){s=null,r="request timeout",o.sendRespon.apply(o,[new Error(r)].concat(t)),e.result=RESULT.TIMEOUT,e.msgsend={data:e.msgsend,error:"request timeout"},o.emit(o.REQERROR,e)},this.options.timeout<=0?1e3:o.options.timeout);this.recvRequest.apply(this,t).then(function(r){if(!s)return void logger.warn("request %s recvRequest return, but already timeout %d",o.msgcode,o.options.timeout);if(clearTimeout(s),"number"!=typeof r)throw new Error("return not number");if(r!==RESULT.GOOD)throw new Error("recvRequest return result error:"+r);o.sendRespon.apply(o,[null].concat(t)),e.result=r,o.emit(o.REQEND,e)}).catch(function(r){if(logger.error("request %s recvRequest error:",o.msgcode,r),!s)return void logger.warn("request %s recvRequest return, but already timeout %d",o.msgcode,o.options.timeout);clearTimeout(s),o.sendRespon.apply(o,[r].concat(t)),e.result>=RESULT.NOCOMPLETE&&(e.result=RESULT.ERROR),e.msgsend=r,o.emit(o.REQERROR,e)})};