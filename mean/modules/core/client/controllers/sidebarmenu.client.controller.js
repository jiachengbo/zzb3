(function () {
  'use strict';

  angular
    .module('core')
    .controller('SidebarMenuController', SidebarMenuController);

  SidebarMenuController.$inject = ['$rootScope', '$state', '$window', 'appService'];

  function SidebarMenuController($rootScope, $state, $window, appService) {
    var vm = this;

    //只能有一个展开的菜单
    var prevMenuItem = null;
    vm.toggleMenuItem = function(menuitem) {
      if (!prevMenuItem) {
        menuitem.isCollapsed = false;
      } else if (prevMenuItem !== menuitem) {
        prevMenuItem.isCollapsed = true;
        menuitem.isCollapsed = false;
      } else {
        menuitem.isCollapsed = !menuitem.isCollapsed;
      }

      prevMenuItem = menuitem;
    };

    vm.clickMenuItem = function(menuitem) {
      //console.log('inwidth: %d, height: %d', $window.innerWidth, $window.innerHeight);
      if ($window.innerWidth <= 767) {
        appService.sideMenuShow = false;
      }
      //滚动到页面顶部
      $window.scrollTo(0, 0);
    };
  }
}());
