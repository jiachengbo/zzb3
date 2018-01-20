(function () {
  'use strict';

  angular
    .module('core.services')
    .factory('NoticeFileService', NoticeFileService);

  NoticeFileService.$inject = ['$resource', '$log'];

  function NoticeFileService($resource, $log) {
    var noticefile = $resource('/api/noticefile');
    return noticefile;
  }
}());
