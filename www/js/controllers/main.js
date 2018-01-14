angular.module('starter')

    .controller('MainCtrl', function ($scope, mediator, notificator,weatherator, $window, $state, $interval) {

        /**
         * when safe condactinf is enable, phone pass to silent mode..
         * if driver respond to a call, a voice notification is fire..
         * 
         */

        $scope.notifications = $window.localStorage['sqas.notifications'] ? angular.fromJson($window.localStorage['sqas.notifications']) : [];

        $scope.currentView = "dashmin";
        $scope.notification = {
            title: "عنوان مهم ",
            text: "نتبه للحيوانات أمامكنتبه للحيوانات أمامك نتبه للحيوانات أمامك نتبه للحيوانات أمامك نتبه للحيوانات أمامك نتبه للحيوانات أمامك نتبه للحيوانات أمامك نتبه للحيوانات أمامكنتبه للحيوانات أمامك"
        };
        //$scope.currentView = "anti-somnolence";


        $scope.goToDash = function () {
            $state.go('tab.dash');
        }
        $scope.goToImportantNumbers = function () {
            $state.go('tab.important-numbers');
        }
        $scope.goToArchive = function () {
            $state.go('tab.archive');
        }
        $scope.goToAntiSomnolence = function () {
            $state.go('tab.anti-somnolence');
        }
        $scope.goToSmartNotification = function () {
            $state.go('tab.smart-notification');
        }


        $scope.launchAnitSomnelence = function () {
            // play 3 vocal advices
            // play a countinous random sound short pulse by rendom delaies..
            mediator.launchPlayingPulses(function () {
                $scope.currentView = "anti-somnolence";
            }, function () {
                $scope.currentView = "dashmin";
            });
            //mediator.animateit('sqas-barr');
        }

        $scope.stopAntiSomnolence = function () {
            mediator.cancelTimer();
        }

        var fctLaunch = function () {

            $scope.today = Date.now();
            $interval(function () {
                $scope.today = Date.now();
            }, 1000 * 60);

            $scope.antiSsomnolenceEenabled = $window.localStorage['sqas.antiSsomnolenceEenabled'] ? angular.fromJson($window.localStorage['sqas.antiSsomnolenceEenabled']) : false;

            if ($scope.antiSsomnolenceEenabled) {

                $scope.launchAnitSomnelence();
            }
            else {
                //$scope.currentView = "main";
            }

            notificator.launchNotificator(function (notification) {
                $scope.notification.text = notification.text;
                $scope.notification.title = notification.title;
                $scope.notification.imageName = notification.imageName;
                $scope.currentView = "main";
            }, function () {
                $scope.currentView = "dashmin";
                console.log("current view :" + $scope.currentView);
            });

        }

        fctLaunch();


        var fctStop = function () {
            if ($scope.antiSsomnolenceEenabled) {
                $scope.stopAntiSomnolence();
            }
        }

        if (ionic.Platform.isWebView()) {
            ionic.Platform.ready(function () {
                cordova.plugins.autoStart.enable();
                $scope.$on('$ionicView.enter', function () {
                    // Anything you can think of
                    fctLaunch();

                });

                $scope.$on('$ionicView.leave', function () {
                    fctStop();
                });

            });

        }
        else {
            /*  */
        }

    })