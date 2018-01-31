angular.module('starter')
    .controller('ArchiveCtrl', function ($scope, $state, azdutils, $window) {
        $scope.goToMain = function () {
            $state.go('tab.main');
        }

        var fct = function () {

            $scope.numOfmsgNotRead = $window.localStorage['sqas.msgNotRead'] ? angular.fromJson($window.localStorage['sqas.msgNotRead']) : 0;
            $scope.notifications = $window.localStorage['sqas.notificationsInbox'] ? angular.fromJson($window.localStorage['sqas.notificationsInbox']) : [];
            $window.localStorage['sqas.msgNotRead'] = angular.toJson(0);
        }

        fct();

        $scope.$on('$ionicView.enter', function () {
            // Anything you can think of
            fct();
        });

    })