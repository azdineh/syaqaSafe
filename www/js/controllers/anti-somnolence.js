angular.module('starter')

    .controller('AntiSomnolenceCtrl', function ($scope, $window,$state, mediator, $interval) {


        $scope.antiSsomnolenceEenabled = $window.localStorage['sqas.antiSsomnolenceEenabled'] ? angular.fromJson($window.localStorage['sqas.antiSsomnolenceEenabled']) : false;

        $scope.toggleChange = function (x) {
            //alert(x);
            $window.localStorage['sqas.antiSsomnolenceEenabled'] = angular.toJson(x);
        }

    })