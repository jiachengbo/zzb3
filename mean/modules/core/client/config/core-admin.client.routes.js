(function () {
  'use strict';

  angular
    .module('core.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admin',
        data: {
          roles: ['xtsz'],
          childSystem: ['admin.**'],
          pageTitle: '系统管理'
        }
      })
      .state('maintenance', {
        abstract: true,
        url: '/maintenance',
        data: {
          roles: ['zzzz'],
          childSystem: ['maintenance.**'],
          pageTitle: '应用维护'
        }
      });
  }
}());
