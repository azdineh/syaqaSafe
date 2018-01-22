angular.module('starter')
.controller('ArchiveCtrl', function ($scope, $state,azdutils) {
    $scope.goToMain = function () {
        $state.go('tab.main');
    }

    $scope.notifications=[];

    azdutils.getSSfromJson("notifications/notifications.json")
    .then(function (arr) {
        $scope.notifications = arr.notifications;

    }, function (err) {
        console.log("Error while getting notification json file..");
        console.log(err);
    });
})