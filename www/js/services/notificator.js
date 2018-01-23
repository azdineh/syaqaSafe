angular.module('starter')
    .factory('notificator', function ($q, azdutils, $interval, weatherator, $cordovaNetwork, $window, mediator) {


        var notifObj = {
            "title": "سشيشس ",
            "text": "نتيس سمخشسينمىش شمسنيتشنسي شمنيتهخصضتثض ثجحصضخثحجصضخث ",
            "soundName": "",
            "imageName": "",
            "times": [
                "14:05",
                "14:05                                                                                                                                                                                                                              ",
                "14:05"
            ],
            "weather": {
                "temperture": ""
            },
            "periodicity": true,
            "numberNotified": 0,
            "urgent": true,
            "monthsNotDo": [
                "7",
                "8"
            ]
        }

        var notificator = function () {
            var vm = {};
            vm.timerNotificator = '';
            vm.notifications = [];

            vm.currentTemperture = 25;


            vm.fillNotifications = function () {
                if (vm.notifications.length > 0) {

                }
                else {
                    azdutils.getSSfromJson("notifications/notifications.json")
                        .then(function (arr) {
                            vm.notifications = arr.notifications;
                            $window.localStorage['sqas.notifications'] = angular.toJson(vm.notifications);

                        }, function (err) {
                            console.log("Error while getting notification json file..");
                            console.log(err);
                        });
                }
            }
            /**
             * @param callbacki called when a notification selected
             * @param callbacki called when a sound notificatio is end
             */
            var counter = 0;

            vm.notificate = function (notification, callbacki, callbackj) {
                mediator.playNotification(notification, true, function () {
                    callbacki()
                }, function () {
                    callbackj()
                });
            }

            vm.launchNotificator = function (callbacki, callbackj) {

                vm.fillNotifications();

                if (!vm.timerNotificator) {
                    vm.timerNotificator = $interval(function () {
                        if (vm.notifications.length > 0) {

                            vm.notifications.forEach(function (notification, index, arr) {
                                if (notification.urgent == true) {
                                    //play notification
                                    vm.notificate(notification, function () {
                                        callbacki(notification)
                                    }, function () {
                                        callbackj();
                                    });
                                }
                                //not urgent
                                /*                                 if (!azdutils.isValIn(azdutils.currentMonthNumber(), notification.monthsNotDo)) {
                                                                    if (azdutils.isValIn(azdutils.currentHHmm(), notification.times)) {
                                                                        if (notification.weather.temperture <= vm.currentTemperture || notification.weather.temperture >= notification.currentTemperture || notification.weather.temperture == "") {
                                                                            //play notification
                                                                            vm.notificate(notification, function () {
                                                                                callbacki()
                                                                            }, function () {
                                                                                callbackj(notification);
                                                                            });
                                
                                                                        }
                                                                        else {
                                                                            console.log("weather not do")
                                                                        }
                                                                    }
                                                                    else {
                                                                        console.log("No notification for this moment..");
 callbacki                                                                   }
                                                                }
                                                                else {
                                                                    console.log("Month not do")
                                                                } */
                            }, this);
                        }


                    }, 1000 * 30)
                }
            }



            return vm;
        }

        return notificator();
    })