"use strict";function Command(e,t){EventEmitter.call(this),this.socket=e,this.cmdRec=this.readCmdRec(t),this.timeoutObj=null,this.options=t.msgarg||{}}var path=require("path"),EventEmitter=require("events"),putils=require(path.resolve("./config/private/utils")),RESULT=require(path.resolve("./modules/private/server/sockets/const.server.socket")).RESULT,logger=require(path.resolve("./config/lib/logger")).getLogger("socketio.command");Command.prototype=Object.create(EventEmitter.prototype),module.exports=Command,Command.prototype.readCmdRec=function(e){return{id:e.id,attempttimes:e.attempttimes,msgcode:e.msgcode,msgsend:e.msgsend,lastsend_time:e.lastsend_time}},Command.prototype.clearTimeout=function(){this.timeoutObj&&(clearTimeout(this.timeoutObj),this.timeoutObj=null)},Command.prototype.timeout=function(){return logger.warn("COMMAND %s timeout %d ms:",this.cmdRec.msgcode,this.options.timeout),Promise.resolve(RESULT.TIMEOUT)},Command.prototype.recvRespon=function(e,t){return e?(logger.warn("COMMAND %s resvRespon error:%j",t.msgcode,e),e instanceof Error||(e=new Error(e.message||"unknow error message")),Promise.reject(e)):(logger.debug("COMMAND %s resvRespon:",t.msgcode,t.msgrecv),Promise.resolve(RESULT.GOOD))},Command.prototype.sendCmd=function(e,t,o){logger.error("COMMAND %s sendCmd not complete",this.cmdRec.msgcode)},Command.prototype.run=function(){var e=this;return new Promise(function(t,o){e.cmdRec.attempttimes++,e.cmdRec.lastsend_time=new Date,e.timeoutObj=setTimeout(function(){e.clearTimeout(),t(e.timeout())},e.options.timeout<=0?1e3:1.5*e.options.timeout),e.sendCmd.call(e,e.cmdRec,e.options,function(r,s){if(!e.timeoutObj)return void logger.error("sendcmd %s after timeout recv respon, ignore",e.cmdRec.msgcode);e.clearTimeout(),e.cmdRec.msgrecv=s,e.options.respon?(e.cmdRec.lastrecv_time=new Date,t(e.recvRespon.call(e,r,e.cmdRec))):r?process.nextTick(o,r):process.nextTick(t,RESULT.GOOD)})}).then(function(t){if("number"!=typeof t)throw new Error("recvReson return not number error");if(e.cmdRec.result=t,t!==RESULT.GOOD)throw new Error("recvReson return number not result.good("+t+")");return e.cmdRec}).catch(function(t){return logger.error("cmd %s run error:",e.cmdRec.msgcode,t.message||t),e.cmdRec.msgrecv||(e.cmdRec.msgrecv=t),!e.options.loss&&e.cmdRec.attempttimes>=e.options.maxTimes||e.options.loss?("number"!=typeof e.cmdRec.result||e.cmdRec.result>=RESULT.NOCOMPLETE)&&(e.cmdRec.result=RESULT.ERROR):e.cmdRec.result=RESULT.NOCOMPLETE,e.cmdRec})};