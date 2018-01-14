angular.module('starter')
    .controller('AboutUsCtrl', function ($scope, $state) {
        $scope.goToMain = function () {
            $state.go('tab.main');
        }
    })