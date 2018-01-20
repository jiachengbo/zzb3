(function () {
  'use strict';

  angular
    .module('core.services')
    .factory('PartymapServiceCore', PartymapServiceCore);

  PartymapServiceCore.$inject = ['$resource', '$log'];

  function PartymapServiceCore($resource, $log) {
    var Partymap = $resource('/api/partymapcore');
    return Partymap;
  }
}());
