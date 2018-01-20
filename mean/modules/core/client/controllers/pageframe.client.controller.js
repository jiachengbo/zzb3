(function () {
  'use strict';

  angular
    .module('core')
    .controller('PageFrameController', PageFrameController);

  PageFrameController.$inject = ['$scope', 'Notification', '$log', 'appService'];

  function PageFrameController($scope, Notification, $log, appService) {
    $scope.pfvm = appService;
  }
}());
