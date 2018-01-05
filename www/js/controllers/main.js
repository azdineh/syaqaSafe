angular.module('starter')

    .controller('MainCtrl', function ($scope, mediator, $window, $state) {

        /**
         * when safe condactinf is enable, phone pass to silent mode..
         * if driver respond to a call, a voice notification is fire..
         * 
         */


        $scope.currentView = "main";
        $scope.today = Date.now();

        $scope.goToDash = function () {
            $state.go('tab.dash');
        }

        if (ionic.Platform.isWebView()) {
            ionic.Platform.ready(function () {


                $scope.launchAnitSomnelence = function () {
                    // play 3 vocal advices
                    // play a countinous random sound short pulse by rendom delaies..
                    $scope.currentView = "anti-somnolenceion";
                    mediator.launchPlayingPulses('sqas-barr');
                    //mediator.animateit('sqas-barr');

                }

                $scope.stopAntiSomnolence = function () {
                    mediator.cancelTimer();
                }


                $scope.$on('$ionicView.enter', function () {
                    // Anything you can think of
                    $scope.antiSsomnolenceEenabled = $window.localStorage['sqas.antiSsomnolenceEenabled'] ? angular.fromJson($window.localStorage['sqas.antiSsomnolenceEenabled']) : false;
                    if ($scope.antiSsomnolenceEenabled) {
                        $scope.launchAnitSomnelence();
                    }

                });

                $scope.$on('$ionicView.leave', function () {
                    if ($scope.antiSsomnolenceEenabled) {
                        $scope.stopAntiSomnolence();
                    }
                });

            });

        }
        else {
            /*  */
        }

    })