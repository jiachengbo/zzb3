(function () {
  'use strict';

  angular
    .module('problem')
    .controller('ProblemModalFormController', ProblemModalFormController);

  ProblemModalFormController.$inject = ['$scope', '$uibModalInstance', 'problemData', 'method'];
  function ProblemModalFormController($scope, $uibModalInstance, problemData, method) {
    var vm = this;
    vm.problemData = problemData;
    vm.method = method;
    vm.disabled = (method === 'view');

    //在这里处理要进行的操作
    vm.ok = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.problemForm');
        return;
      }
      $uibModalInstance.close(vm.problemData);
    };
    vm.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  }
}());
