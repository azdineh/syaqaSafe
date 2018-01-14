angular.module('starter')
    .factory('notificator', function ($q, azdutils, $interval, $window, mediator) {

        var notification = {
            text: "",
            soundName: "",
            imageName: "",
            time: {
                first: '',
                last: ''
            },
            weather: {
                temperture: 12,
            },
            periodicity: false,
            times: 0,
            urgent: false,
            newest: false
        }

        var notificator = function () {
            var vm = {};
            vm.timerNotificator = '';
            vm.notifications = [];

            vm.currentTemperture = 12;


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
            vm.launchNotificator = function (callbacki, callbackj) {

                vm.fillNotifications();

                vm.timerNotificator = $interval(function () {
                    if (vm.notifications.length > 0) {
                        vm.notifications.forEach(function (notification, index, arr) {
                            if (notification.urgent == true) {
                                //launch notification

                                if (mediator.isPlaying == true) {
                                    mediator.media.stop();
                                }
                                mediator.playOnePulse(1000, notification.soundName, true, function () {
                                    callbacki(notification);
                                }, function () {
                                    callbackj();
                                });
                            }
                            //not urgent
                            if (!azdutils.isValIn(azdutils.currentMonthNumber(), notification.monthsNotDo)) {
                                if (azdutils.isValIn(azdutils.currentHHmm(), notification.times)) {
                                    if (notification.weather.temperture <= vm.currentTemperture || notification.weather.temperture >= notification.currentTemperture || notification.weather.temperture == "") {
                                        //launch a notification.
                                        if (mediator.isPlaying == true) {
                                            mediator.media.stop();
                                        }
                                        mediator.playOnePulse(1500, notification.soundName, true, function () {
                                            callbacki(notification);
                                        }, function () {
                                            callbackj();
                                        });
                                    }
                                    else {
                                        console.log("weather not do")
                                    }
                                }
                                else {
                                    console.log("No notification for this moment..");
                                }
                            }
                            else {
                                console.log("Month not do")
                            }
                        }, this);
                    }


                }, 1000 * 60)
            }



            return vm;
        }

        return notificator();
    })