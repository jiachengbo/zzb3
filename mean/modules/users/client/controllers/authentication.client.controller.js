(function () {
  'use strict';

  angular
    .module('users')
    .controller('appServiceController', appServiceController);

  appServiceController.$inject = ['$scope', '$state', '$location', '$window', '$timeout',
    'appService', 'UsersService', 'PasswordValidator', 'Notification'];

  function appServiceController($scope, $state, $location, $window, $timeout,
        appService, UsersService, PasswordValidator, Notification) {
    var vm = this;

    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;
    vm.signup = signup;
    vm.signin = signin;
    vm.callOauthProvider = callOauthProvider;
    vm.usernameRegex = /^(?=[\w.-]+$)(?!.*[._-]{2})(?!\.)(?!.*\.$).{3,34}$/;

    // Get an eventual error defined in the URL query string:
    if ($location.search().err) {
      Notification.error({ message: $location.search().err });
    }

    // If user is signed in then redirect back home
    if (appService.user) {
      //$location.path('/');
      return appService.gotoHome();
    }
/*
    //不能直接访问登录地址
    if (!$state.previous || !$state.previous.state ||
      !$state.previous.state.name || $state.previous.state.name === '') {
      appService.gotoHome();
    }
*/
    if ($state.current && $state.current.name === appService.gotoDefine.signin.state) {
      $timeout(function () {
        //默认显示标题
        vm.titleStyle = {
          diaplay: 'block'
        };

        //默认标题背景
        vm.signTitle = $window.sharedConfig.longTitle;
        vm.signImgUrl = '/modules/users/client/img/sign-bg.png';

        //设置跳转定义，并返回登录参数
        var data = appService.signinOpen($state);
        if (data) {
          if (data.pageTitle) {
            vm.signTitle = data.pageTitle;
          }
          if (data.titleStyle) {
            vm.titleStyle = data.titleStyle;
          }

          if (data.imgUrl) {
            vm.signImgUrl = data.imgUrl;
          }

          //form显示设置
          if (data.formFill) {
            vm.formFill = data.formFill;
          }
        }
        vm.style = {
          'background-image': 'url(' + vm.signImgUrl + ')'
        };
      });
    }


    function signup(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      UsersService.userSignup(vm.credentials)
        .then(onUserSignupSuccess)
        .catch(onUserSignupError);
    }

    function signin() {
      //使用ng-submit提交时，防止浏览器自动填充信息还没有更新到绑定数据
      $timeout(function () {
        if (!vm.userForm.$valid) {
          $scope.$broadcast('show-errors-check-validity', 'vm.userForm');
        } else {
          UsersService.userSignin(vm.credentials)
            .then(onUserSigninSuccess)
            .catch(onUserSigninError);
        }
      }, 200);
    }

    // OAuth provider request
    function callOauthProvider(url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    }

    // appService Callbacks
    function onUserSignupSuccess(response) {
      // If successful we assign the response to the global user model
      //注册成功
      appService.signup(response);
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Signup successful!' });
      // And redirect to the previous or home page
      //$state.go(($state.previous && $state.previous.state && $state.previous.state.name) || 'home', $state.previous && $state.previous.params);
    }

    function onUserSignupError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Signup Error!', delay: 6000 });
    }

    function onUserSigninSuccess(response) {
      // If successful we assign the response to the global user model
      //登录成功
      appService.signin(response);

      Notification.info({ message: '欢迎使用 ' + response.firstName });

      // And redirect to the previous or home page
      //$state.go(($state.previous && $state.previous.state && $state.previous.state.name) || 'home', $state.previous && $state.previous.params);
    }

    function onUserSigninError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Signin Error!', delay: 6000 });
    }
  }
}());
