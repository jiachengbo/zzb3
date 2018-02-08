(function () {
  'use strict';

  angular
    .module('advice')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('sidemenu', {
      title: '投诉建议',
      state: 'advice.curd',
      roles: ['*'],
      position: 0
    });

    // Add the dropdown list item
    /*menuService.addSubMenuItem('sidemenu', 'advice', {
      title: 'manager Advice Table',
      state: 'advice.curd',
      roles: ['*']
    });*/

  }
}());
