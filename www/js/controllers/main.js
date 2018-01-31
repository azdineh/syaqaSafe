angular.module('starter')

    .controller('MainCtrl', function ($scope, $rootScope, mediator, notificator, weatherator, $window, $state, $interval) {

        /**
         * when safe condactinf is enable, phone pass to silent mode..
         * if driver respond to a call, a voice notification is fire..
         * 
         */

        // $scope.notifications = $window.localStorage['sqas.notifications'] ? angular.fromJson($window.localStorage['sqas.notifications']) : [];
        $scope.weatherObj = {};
        $scope.currentView = "dashmin";
        $scope.notification = {
            title: "عنوانعنوان عنوان عنوعنون عنو عنوان عنوان مهم ",
            text: "نتبه للحيوانات أمامكنتبه للحيوانات أمامك نتبه للحيوانات أمامك نتبه للحيوانات أمامك نتبه للحيوانات أمامك نتبه للحيوانات أمامك نتبه للحيوانات أمامك نتبه للحيوانات أمامكنتبه للحيوانات أمامك",
            imageName: "ramadan-01"
        };

        $scope.today = Date.now();

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



/*         $scope.launchAnitSomnelence = function () {
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
        } */


        $scope.endInit = false;

        var counter = 0;
        $scope.initWhenTap = function () {
            $scope.endInit = false;
            counter = 0;
            $scope.init();
        }

        $scope.init = function () {
            $scope.today = Date.now();

            if (counter == 0) {
                weatherator.initWeather(function (weatherObj) {
                    $scope.weatherObj = weatherObj;
                    $scope.endInit = true;
                });
            }


            $scope.antiSsomnolenceEenabled = $window.localStorage['sqas.antiSsomnolenceEenabled'] ? angular.fromJson($window.localStorage['sqas.antiSsomnolenceEenabled']) : false;
            $scope.msgNotRead = $window.localStorage['sqas.msgNotRead'] ? angular.fromJson($window.localStorage['sqas.msgNotRead']) : 0;

        }




/*         var fctStop = function () {
            if ($scope.antiSsomnolenceEenabled) {
                //  $scope.stopAntiSomnolence();
            }
        } */


        if (ionic.Platform.isWebView()) {
            ionic.Platform.ready(function () {

                $scope.init();
                cordova.plugins.autoStart.enable();

                if (!$scope.timerWeather) {
                    $scope.timerWeather = $interval(function () {
                        $scope.today = Date.now();

                        if (counter == 15) {
                            weatherator.initWeather(function (weatherObj) {
                                $scope.weatherObj = weatherObj;
                            });

                            counter = 1;
                        }
                        else {
                            counter += 1;
                        }

                    }, 1000 * 60);

                }
                /*                 $scope.stopPlying = function () {
                                    mediator.stopSound(function () {
                                        $scope.currentView = "dashmin";
                                    });
                                } */

                notificator.launchNotificator(function (notification) {
                    if (notification.isAntiSomnolenceNotif == true) {
                        $scope.currentView = "anti-somnolence";
                        $scope.notification.text = "";
                        $scope.notification.title = "";
                        $scope.notification.imageName = "";
                        $scope.antiSonolenceDelay = notification.delay;
                    }
                    else {
                        $scope.currentView = "main";
                        $scope.notification.text = notification.text;
                        $scope.notification.title = notification.title;
                        $scope.notification.imageName = notification.imageName != null ? notification.imageName : 'nosoundimage';

                        $scope.msgNotRead += 1;
                        $window.localStorage['sqas.msgNotRead'] = $scope.msgNotRead;
                    }
                }, function () {
                    if (!mediator.alreadyClosed) {
                        $scope.currentView = "dashmin";
                        console.log("current view :" + $scope.currentView);
                    }
                }, function (notifAntiSomnolence) {
                    console.log("Anti somnolence notife ..");
                    $scope.notifAntiSomnolence = notifAntiSomnolence;
                });


                $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
                    weatherator.initWeather(function (weatherObj) {
                        $scope.weatherObj = weatherObj;
                        $scope.endInit = true;
                    });
                })

                $scope.$on('$ionicView.enter', function () {
                    // Anything you can think of
                    $scope.init();

                });

                $scope.$on('$ionicView.leave', function () {
                    
                });

            });

        }
        else {
            /*  */
        }



    })



    //filters
    .filter('sqastemp', function () {
        return function (input) {
            var temp;
            if (input != "") {
                temp = Math.ceil(input) + " " + "°C";
            } else {
                temp = "--"
            }

            return temp;
        }
    })



    .filter('sqastempdescr', function () {
        return function (input) {
            var descr;
            switch (input) {
                case 'غائم جزئ':
                    descr = "غائم جزئيا"
                    break;

                case '':
                    descr = ""
                    break;

                default:
                    descr = input;
                    break;
            }

            return descr;
        }
    })