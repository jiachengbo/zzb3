(function () {
  'use strict';

  angular
    .module('global')
    .controller('jcxxglController', jcxxglController);

  jcxxglController.$inject = ['$state'];
  function jcxxglController($state) {
    var vm = this;
    vm.imgName = $state.$current.data.pageTitle;
    console.log(11111111111);
    console.log(vm.imgName);
    vm.tiaozhuan = function (num) {
      var src = `/modules/global/client/img/home/活动${num}.png`;
      console.log(src);
      $('.first>img').attr('src', src);
    };
  }
}());
