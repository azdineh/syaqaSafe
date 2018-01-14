angular.module('starter')

    .controller('ImportantNumbersCtrl', function ($scope, $state) {

        $scope.callNumber = function (number) {
            window.location.href = "tel://" + number;
        }

        $scope.goToMain = function () {
            $state.go('tab.main');
        }
    })