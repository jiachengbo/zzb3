(function () {
  'use strict';

  angular
    .module('global')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$rootScope', 'Notification', '$log', '$uibModal', 'appService', 'menuService',
    'Socket', '$state', '$window', '$timeout', 'UserMsg', 'baseCodeService'];

  function HeaderController($scope, $rootScope, Notification, $log, $uibModal, appService, menuService,
                            Socket, $state, $window, $timeout, UserMsg, baseCodeService) {
    var vm = this;
    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = appService;
    vm.menus = menuService;
    var jcxxglarr = ['partygk','partymer','sanhui','notice','firstshuji','banzi','partyzuzhi'];
    var cityjcdjarr = ['threefive','prowall','worknode','project','build','build','partydt','jobduty','litterwish','partymap'];
    if (!appService.user) {
      $state.go('authentication.signin');
    }
    Array.prototype.remove = function (from, to) {
      var rest = this.slice((to || from) + 1 || this.length);
      this.length = from < 0 ? this.length + from : from;
      return this.push.apply(this, rest);
    };
    console.log(appService.user);
    //待处理任务
    vm.userWaitHandles = [];
    // 消息
    vm.stateChangeMsg = [
      {
        djdt: 0,
        name: '党建动态'
      },
      {
        problemwall: 0,
        name: '问题墙'
      }
    ];

    var winowHeight = $window.innerHeight; //获取窗口高度
    var headerHeight = 191;
    var footerHeight = 18;

    var height = winowHeight - headerHeight - footerHeight;
    $rootScope.styles = {
      'min-height': height + 'px',
      position: 'relative'
    };
    $rootScope.tops = {
      position: 'relative',
      top: height - 320 + 'px'
    };
    if (appService.user) {
      if(appService.user.roles.length > 0){
        var nums = appService.user.roles.indexOf('xtsz');
        if(nums !== -1){
          appService.user.roles.remove(nums);
        }
        $window.localStorage.setItem('roles', JSON.stringify(appService.user.roles));
      }
      vm.roles = JSON.parse($window.localStorage.getItem('roles'));
      vm.role1 = angular.copy(vm.roles);
      vm.role2 = angular.copy(vm.roles);
      console.log(vm.role1, vm.role2);
      var str;
      var str1;
      jcxxglarr.forEach(function (v, k) {
        if(vm.role1.indexOf(v) !== -1){
          str = vm.role1.indexOf(v);
          vm.role1.remove(str);
        }
      });
      cityjcdjarr.forEach(function (v, k) {
        if(vm.role2.indexOf(v) !== -1){
          str1 = vm.role2.indexOf(v);
          vm.role2.remove(str1);
        }
      });
      console.log(vm.role1, vm.role2);
      if (appService.user.jobs === 1) {
        vm.fff = false;
        vm.userjob = false;
      } else if (appService.user.jobs !== 1) {
        vm.fff = true;
        vm.userjob = true;
      }
    }
    if (!Socket.socket) {
      //等候socket有效
      $scope.$on('socketCreate', initSocket());
    } else {
      initSocket();
    }
    function initSocket() {
      Socket.on('task', function (msg) {
        vm.taskAccepter = JSON.parse(msg.Relation);
        angular.forEach(vm.taskAccepter, function (value, k) {
          if (value.cjId === UserMsg.gradeId) {
            if (Array.isArray(value.objId)) {
              angular.forEach(value.objId, function (value2, k2) {
                if (value2 === UserMsg.objId) {
                  vm.userWaitHandles.push(msg.taskdata);
                  // $window.alert('您有新的任务了！');
                  Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 您有新的任务了！!'});
                }
              });
            } else {
              if (value.objId === UserMsg.objId) {
                vm.userWaitHandles.push(msg.taskdata);
                // $window.alert('您有新的任务了！');
                Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 您有新的任务了！!'});
              }
            }
          }
        });
      });
      Socket.on('reply', function (msg) {
        vm.replydata = msg.replydata;
        vm.replyAccepter = vm.replydata.toPersonId;
        angular.forEach(vm.replyAccepter, function (value, k) {
          if (value === UserMsg.objName) {
            // $window.alert('有消息了！！！！！！！！')
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 您有新的回复消息了!'});
          }
        });
      });
      Socket.on('appeal', function (msg) {
        var appealAccepter = msg.appealdata;
        if (UserMsg.gradeId === 1) {
          if (appealAccepter.gradeId === 1 || appealAccepter.gradeId === 2 || appealAccepter.gradeId === 3) {
            vm.stateChangeMsg[0].djdt++;
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 您有上报的党建动态消息了!'});
          }
        } else {
          if (UserMsg.gradeId === appealAccepter.gradeId && appService.user.JCDJ_User_roleID === appealAccepter.roleId) {
            vm.stateChangeMsg[0].djdt++;
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 您有上报的党建动态消息了!'});
          }
        }
      });
      Socket.on('problewall', function (msg) {
        var problewallSBAccepter = msg.problewalldata.sb;
        var problewallXFAccepter = msg.problewalldata.xf;
        angular.forEach(problewallSBAccepter, function (value, k) {
          if (value.gradeId === UserMsg.gradeId && appService.user.JCDJ_User_roleID === value.roleId) {
            vm.stateChangeMsg[1].problemwall++;
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 您有新的问题墙消息了!'});
          }
        });
        angular.forEach(problewallXFAccepter, function (value1, k1) {
          if (value1.gradeId === UserMsg.gradeId && appService.user.JCDJ_User_roleID === value1.roleId) {
            vm.stateChangeMsg[1].problemwall++;
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 您有新的问题墙消息了!'});
          }
        });
        console.log(vm.stateChangeMsg);
      });

      $scope.$on('$destroy', function () {
        Socket.removeListener('STATEIN');
        Socket.removeListener('STATEOUT');
        Socket.removeListener('DISPATCH');
      });
    }
    vm.openStateChangeMsgModal = function (resarg) {
      return $uibModal.open({
        templateUrl: '/modules/global/client/views/stateChangeMsgModal.client.view.html',
        controller: 'StateChangeMsgController',
        controllerAs: 'vm',
        backdrop: 'static',
        size: 'lg',
        resolve: resarg
      });
    };
    vm.openStateChangeMsgModalInstance = function () {
      var StateChangeMsgModalInstance = vm.openStateChangeMsgModal({
        msgData: function () {
          return vm.stateChangeMsg;
        }
      });
      StateChangeMsgModalInstance.result.then(function (result) {
        $log.log('modal ok:', result);
        vm.stateChangeMsg = [
          {
            djdt: 0,
            name: '党建动态'
          },
          {
            problemwall: 0,
            name: '问题墙'
          }
        ];
      });
    };
    vm.openTaskMsgModal = function (resarg) {
      return $uibModal.open({
        templateUrl: '/modules/global/client/views/taskMsgModal.client.view.html',
        controller: 'TaskMsgModalController',
        controllerAs: 'vm',
        backdrop: 'static',
        size: 'lg',
        resolve: resarg
      });
    };
    vm.openTaskMsgModalInstance = function () {
      var TaskMsgModalInstance = vm.openTaskMsgModal({
        taskData: function () {
          return vm.userWaitHandles;
        }
      });
      TaskMsgModalInstance.result.then(function (result) {
        $log.log('modal ok:', result);
        vm.userWaitHandles = [];
      });
    };
    var supers;
    /*if (appService.user) {
      var PartyBranch = baseCodeService.getItems('dj_PartyBranch');
      if (appService.user.user_grade === 4 || appService.user.user_grade === 6) {
        appService.user.roles.push('dangwei');
      } else if (appService.user.user_grade === 5 || appService.user.user_grade === 7) {
        appService.user.roles.push('danggongwei');
      }
      angular.forEach(PartyBranch, function (v, k) {
        if (v.OrganizationId === appService.user.branch) {
          supers = v.super;
        }
      });
    }*/
    vm.itemClick = function (params, type) {
      appService.user2 = {};
      switch (params) {
        case 'xtsz':
          if (appService.user2) {
            delete appService.user2;
          }
          appService.basicMsg = false;
          menuService.leftMenusCollapsed = false;
          appService.user.roles = ['xtsz'];
          $state.go('home');
          $rootScope.showmuse1 = true;
          break;
        case 'xcjy':
          appService.basicMsg = false;
          if (appService.user2) {
            delete appService.user2;
          }
          menuService.leftMenusCollapsed = true;
          $state.go('page.edu');
          angular.element(document.querySelectorAll('.amenu')).removeClass('active');
          angular.element(document.querySelector('.xcjy')).addClass('active');
          break;
        case 'cityjcdj':
          appService.basicMsg = false;
          if (appService.user2) {
            delete appService.user2;
          }
          menuService.leftMenusCollapsed = true;
          if (appService.user.user_grade === 1) {
            $state.go('page.citybasicparty');
          } else if (appService.user.user_grade === 2 || appService.user.user_grade === 4 || appService.user.user_grade === 6 || appService.user.user_grade === 9 || (appService.user.user_grade === 5 && (appService.user.JCDJ_User_roleID < 44 && appService.user.JCDJ_User_roleID > 40)) || (appService.user.user_grade === 7 && supers > 9) || (appService.user.user_grade === 10 && supers > 9)) {
            $state.go('page.citybasicparty-other');
          } else if ((appService.user.user_grade === 5 && appService.user.JCDJ_User_roleID < 41)) {
            $state.go('page.citybasicparty-str');
          } else if ((appService.user.user_grade === 7 && supers < 10) || (appService.user.user_grade === 10 && supers < 10)) {
            $state.go('page.citybasicparty-comm');
          } else if (appService.user.user_grade === 3) {
            $state.go('page.citybasicpartydgw');
          }
          angular.element(document.querySelectorAll('.amenu')).removeClass('active');
          angular.element(document.querySelector('.cityjcdj')).addClass('active');
          break;
        case 'video':
          appService.basicMsg = false;
          if (appService.user2) {
            delete appService.user2;
          }
          menuService.leftMenusCollapsed = true;
          $state.go('home');
          angular.element(document.querySelectorAll('.amenu')).removeClass('active');
          angular.element(document.querySelector('.videoson')).addClass('active');
          break;
        case 'myparty':
          appService.user2.roles = vm.role1;
          appService.basicMsg = true;
          menuService.leftMenusCollapsed = false;
          appService.user.roles = vm.role2;
          $state.go('home');
          /*$rootScope.$watch('$rootScope.sidemenu', function () {
           $rootScope.sidemenu = menuService.getMenu('sidemenu');
           $rootScope.menus = menuService;
           console.log('aaaaaaaaaaaa');
           console.log($rootScope.sidemenu);
           for (var i = 0; i < $rootScope.sidemenu.items.length; i++) {
           $rootScope.sidemenu.items[i].icon2 = '/modules/core/client/img/header/符号.png';
           $rootScope.sidemenu.items[i].icon1 = '/modules/core/client/img/header/符号.png';
           }
           });*/
          $rootScope.showmuse1 = false;
          angular.element(document.querySelectorAll('.amenu')).removeClass('active');
          angular.element(document.querySelector('.myparty')).addClass('active');
          break;
        case 'jcxxgl':
          if (appService.user2) {
            delete appService.user2;
          }
          menuService.leftMenusCollapsed = true;
          if (appService.user.user_grade === 1) {
            $state.go('page.basicmsg');
          } else if (appService.user.user_grade === 2) {
            $state.go('page.basicmsg-dangwei');
          } else if (appService.user.user_grade === 3) {
            $state.go('page.basicmsg-danggongwei');
          } else if (appService.user.user_grade === 4 || appService.user.user_grade === 5) {
            $state.go('page.basicmsg-org');
          } else if (appService.user.user_grade === 6 || appService.user.user_grade === 7) {
            $state.go('page.basicmsg-branch');
          } else if (appService.user.user_grade === 9 || appService.user.user_grade === 10) {
            $state.go('page.basicmsg-branch2');
          }

          angular.element(document.querySelectorAll('.amenu')).removeClass('active');
          angular.element(document.querySelector('.jcxxgl')).addClass('active');
          break;
        case 'task':
          appService.basicMsg = false;
          if (appService.user2) {
            delete appService.user2;
          }
          menuService.leftMenusCollapsed = true;
          if (appService.user.user_grade < 11) {
            $state.go('task.curd');
          }
          angular.element(document.querySelectorAll('.amenu')).removeClass('active');
          angular.element(document.querySelector('.task')).addClass('active');
          break;
        default:
          break;
      }
    };
    /*vm.myPartyBuild = function () {
      vm.role = [appService.user.roles[0], appService.user.roles[1], appService.user.roles[2]];
      vm.role.push('jcxxgl');
      appService.basicMsg = true;
     // appService.user.roles = vm.role;
      appService.user2 = {};
      appService.user2.roles = ['user', 'admin', 'jcxxgl', 'cityjcdj'];
    };*/
  }
}());
