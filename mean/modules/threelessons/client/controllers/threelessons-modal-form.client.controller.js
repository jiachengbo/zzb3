(function () {
  'use strict';

  angular
    .module('threelessons')
    .controller('ThreelessonsModalFormController', ThreelessonsModalFormController);

  ThreelessonsModalFormController.$inject = ['$scope', '$uibModalInstance', 'threelessonsData', 'method', 'UserMsg'];
  function ThreelessonsModalFormController($scope, $uibModalInstance, threelessonsData, method, UserMsg) {
    var vm = this;
    vm.threelessonsData = threelessonsData;
    vm.method = method;
    if (vm.method === 'add') {
      vm.method = '新增';
    } else if (vm.method === 'update') {
      vm.method = '修改';
    } else if (vm.method === 'view') {
      vm.method = '查看';
    }
    vm.disabled = (method === 'view');
//日期选择器
    $scope.today = function () {
      var now = new Date();
      now.setDate(1);
      // $scope.dt1 = now;
      $scope.dt1 = new Date(); // 开始时间
      $scope.dt2 = new Date(); // 结束时间
    };
    $scope.today();
    $scope.clear = function () {
      $scope.dt1 = null;
      $scope.dt2 = null;
    };

    $scope.inlineOptions = {
      customClass: getDayClass,
      minDate: new Date(),
      showWeeks: true
    };

    $scope.toggleMin = function () {
      $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
    };

    $scope.toggleMin();
    $scope.open1 = function () {
      $scope.popup1.opened = true;
    };

    $scope.open2 = function () {
      $scope.popup2.opened = true;
    };

    $scope.popup1 = {
      opened: false
    };

    $scope.popup2 = {
      opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    $scope.events = [
      {
        date: tomorrow,
        status: 'full'
      },
      {
        date: afterTomorrow,
        status: 'partially'
      }
    ];

    function getDayClass(data) {
      var date = data.date,
        mode = data.mode;
      if (mode === 'day') {
        var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

        for (var i = 0; i < $scope.events.length; i++) {
          var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

          if (dayToCheck === currentDay) {
            return $scope.events[i].status;
          }
        }
      }
      return '';
    }

    //在这里处理要进行的操作
    vm.ok = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.threelessonsForm');
        return;
      }
      if (vm.method === '新增' || vm.method === '修改') {
        vm.threelessonsData.starttime = $scope.dt1;
        vm.threelessonsData.endtime = $scope.dt2;
      }
      if (vm.create_photoPicFile) {
        vm.threelessonsData.photo = vm.create_photoPicFile;
      }
      if (vm.fileFile) {
        vm.threelessonsData.file_path = vm.fileFile;
      }
      vm.threelessonsData.gradeId = UserMsg.gradeId;
      vm.threelessonsData.objId = UserMsg.objId;
      console.log($scope.dt1, $scope.dt2, vm.threelessonsData);
      $uibModalInstance.close(vm.threelessonsData);
    };
    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
}());
