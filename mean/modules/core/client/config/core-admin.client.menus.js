(function () {
  'use strict';

  angular
    .module('core.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    //应用维护
    menuService.addMenuItem('sidemenu', {
      state: 'maintenance',
      type: 'dropdown',
      position: 1000
    });
    //系统管理
    menuService.addMenuItem('sidemenu', {
      state: 'admin',
      type: 'dropdown',
      position: 1100
    });
  }
}());
