angular.module('starter')
.controller('ArchiveCtrl', function ($scope, $state) {
    $scope.goToMain = function () {
        $state.go('tab.main');
    }
})