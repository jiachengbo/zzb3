(function () {
  'use strict';

  angular
    .module('muser')
    .controller('MUserEditController', MUserEditController);

  MUserEditController.$inject = ['$scope', 'Notification', '$log', '$window', '$state', '$stateParams',
    'treeService', 'WorkPositionService'];
  function MUserEditController($scope, Notification, $log, $window, $state, $stateParams,
                                      treeService, WorkPositionService) {
    var vm = this;
    //当前行数据
    vm.muser_row = $stateParams.muser_row;
    //部门、岗位表所有数据
    vm.department_rows = $stateParams.department_rows;
    vm.workposition_rows = $stateParams.workposition_rows;
    //进行的操作
    vm.muser_rowop = $stateParams.muser_rowop;
    //不能修改
    vm.disabled = vm.muser_rowop.disabled;

    //设置cvm，用于回传本控制
    vm.muser_rowop.cvm = vm;

    vm.treeOptions = {
      dirSelectable: true,
      allowDeselect: false,
      //是否是文件,显示不同图标
      isLeaf: function (node) {
        return vm.isWorkPositionNode(node);
      }
    };

    vm.treeData = {};
    vm.expanded = [];
    vm.selected = null;

    vm.isWorkPositionNode = function (node) {
      return node.value instanceof WorkPositionService;
    };

    //列表显示的内容
    vm.treeTitle = function(node) {
      return node.value.displayName ? node.value.displayName : node.value.name;
    };

    //显示选择行
    vm.showSelected = function(sel) {
      if (sel) {
        //展开父
        if (vm.expanded.indexOf(sel.parent) === -1) {
          if (sel.parent) {
            vm.expanded.push(sel.parent);
          } else {
            vm.expanded.push(sel);
          }
        }
        vm.selected = sel;
      }
    };

    vm.changed = function(node) {
      var workposition = {id: node.value.id};
      //删除当前数据保存的指定workposition.id的记录
      for (var index = 0; index < vm.muser_row.wps.length; index++) {
        if (vm.muser_row.wps[index].id === workposition.id) {
          vm.muser_row.wps.splice(index, 1);
          break;
        }
      }

      if (node.value.selected) {
        vm.muser_row.wps.push(workposition);
      }
    };

    var workpositions = vm.workposition_rows.map(function (ele) {
      ele.selected = vm.muser_row.wps.some(function(workposition) {
        return ele.id === workposition.id;
      });
      return ele;
    });
    vm.serviceTree = treeService.getTreeData(vm.department_rows, 'id', 'parentId', 'children',
      vm.workposition_rows, 'department_id');
    vm.treeData = vm.serviceTree.getNodes();
    vm.showSelected(vm.treeData[0]);
  }
}());
