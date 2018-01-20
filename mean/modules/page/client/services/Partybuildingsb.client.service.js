(function () {
  'use strict';

  angular
    .module('core.services')
    .factory('PartyBuildingSbService', PartyBuildingSbService);

  PartyBuildingSbService.$inject = ['$resource', '$log'];

  function PartyBuildingSbService($resource, $log) {
    var Partymap = $resource('/api/partybuildingsb');
    return Partymap;
  }
}());
