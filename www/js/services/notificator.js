angular.module('starter')
    .factory('notificator', function ($q, azdutils, $interval, $filter, $timeout, weatherator, $http, $cordovaNetwork, $window, mediator) {


        var notificator = function () {
            var vm = {};
            vm.timerNotificator = '';
            //local notifications
            vm.notifications = $window.localStorage['sqas.notifications'] ? angular.fromJson($window.localStorage['sqas.notifications']) : [];
            vm.notificationsToPlay = [];
            vm.notificationsToRead = $window.localStorage['sqas.notificationsInbox'] ? angular.fromJson($window.localStorage['sqas.notificationsInbox']) : [];

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
            var isNotificateOff = true;
            vm.notificate = function (callbacki, callbackj) {

                if (vm.notificationsToPlay.length > 0) {
                    isNotificateOff = false;
                    var notif = vm.notificationsToPlay.shift();

                    if (notif.isAntiSomnolenceNotif == true) {
                        var antiSomnolence_flag = $window.localStorage['sqas.antiSsomnolenceEenabled'] ? angular.fromJson($window.localStorage['sqas.antiSsomnolenceEenabled']) : false;
                        if (antiSomnolence_flag == false) {
                            vm.notifications = $filter('filter')(vm.notifications, { isAntiSomnolenceNotif: false });
                            notif = vm.notificationsToPlay.shift();
                        }
                        else {
                            //notif = vm.notificationsToPlay.shift();
                        }
                    }
                    else {
                        notif.receiveDate = Date.now();
                        vm.notificationsToRead.unshift(notif);
                        $window.localStorage['sqas.notificationsInbox'] = angular.toJson(vm.notificationsToRead);
                    }

                    if (notif != null) {
                        mediator.playNotification(notif, true, function () {
                            callbacki(notif)
                        }, function () {
                            callbackj()
                            $timeout(function () {
                                vm.notificate(function (nn) { callbacki(nn) }, function () { callbackj() });
                            }, 10 * 1000);
                        });
                    }
                }
                else {
                    isNotificateOff = true;
                    console.log("End of notificate..")
                }

            }
            var fct0 = function (callbacki, callbackj, callbackAntiSomnolence) {
                var antiSomnolence_flag = $window.localStorage['sqas.antiSsomnolenceEenabled'] ? angular.fromJson($window.localStorage['sqas.antiSsomnolenceEenabled']) : false;
                vm.currentTemperture = $window.localStorage['sqas.weatherObj'] ?
                    angular.fromJson($window.localStorage['sqas.weatherObj']).main.temp : 25;

                if (vm.notifications.length > 0) {

                    vm.notifications.forEach(function (notification, index, arr) {
                        if (notification.urgent == true) {
                            console.log("--> " + index + ": Notification : Urgent");
                            //play notification
                            vm.notificationsToPlay.push(notification);
                            vm.notifications[index].urgent = false;
                            $window.localStorage['sqas.notifications'] = angular.toJson(vm.notifications);

                        }
                        //not urgent
                        var perio = azdutils.getPeriodicity(notification.date);
                        if (perio == notification.periodicity || perio == "onetime") {
                            //console.log(azdutils.getPeriodicity(notification.date) + " -- " + notification.periodicity);
                            console.log("--> " + index + ": Notification : ");
                            console.log("       Periodicity : " + perio);

                            if (azdutils.isNotifWeatherConvenable(vm.currentTemperture, notification.weather.temperture) == true) {
                                //vm.notificationsToPlay.push(notification);
                                console.log("       Current temperature : " + vm.currentTemperture + " °C")
                                console.log("       Weather convenable: " + notification.weather.temperture);

                                if (!azdutils.isValIn(azdutils.currentMonthNumber(), notification.monthsNotDo)) {
                                    console.log("       Month : Convenable");
                                    if (azdutils.isValIn(azdutils.currentHHmm(), notification.times) == true) {
                                        console.log("       Time : Convenable");
                                        vm.notificationsToPlay.push(notification);
                                    }
                                    else {
                                        console.log("        No notification for this moment..");
                                    }
                                }
                                else {
                                    console.log("       Month not do")
                                }


                            }
                            else {
                                console.log("       Weather not do")
                            }


                        }
                        else {
                            console.log("         No corresspondance periodicity found..");
                        }
                    }, this);
                }

                if (antiSomnolence_flag == true) {
                    console.log("Start anti-somnolence")
                    mediator.launchAntiSomnolence(function () {
                    }, function (notif) {
                        vm.notificationsToPlay.push(notif);
                        callbackAntiSomnolence(notif);
                        console.log("%cAnti somnolence Nnotification pushed, delay is:" + notif.delay + "", "color: green");
                    })
                } else {
                    if (mediator.timerAntiSomnolence) {
                        mediator.stopYimerAntiSomnolence();
                    }
                }

                if (isNotificateOff == true) {
                    vm.notificate(function (notification) {
                        callbacki(notification)
                    }, function () {
                        callbackj();
                    });
                }

            }
            vm.launchNotificator = function (callbacki, callbackj, callbackAntiSomnolence) {

                vm.fillNotifications();

                $timeout(function () {
                    fct0(function (notif) {
                        callbacki(notif)
                    }, function () {
                        callbackj()
                    }, function (notif) {
                        callbackAntiSomnolence(notif)
                    });
                }, 12 * 1000);

                if (!vm.timerNotificator) {



                    vm.timerNotificator = $interval(function () {

                        fct0(function (notif) {
                            callbacki(notif)
                        }, function () {
                            callbackj()
                        }, function (notif) {
                            callbackAntiSomnolence(notif)
                        });


                    }, 1000 * 40)

                    var counterServerTimer = 0;
                    if (!vm.serverTimer) {

                        vm.serverTimer = $interval(function () {

                            if ($cordovaNetwork.isOnline()) {


                                if (counterServerTimer == 0) {

                                    console.log('%cSend new notifcation request', "color:blue");
                                    //var arr_index = [];
                                    $http({
                                        method: 'GET',
                                        url: "http://www.syaqasafe.rf.gd/getnewnotif.php"
                                    }).then(function mySuccess(jsonstring) {
                                        console.log('%c Ok' + jsonstring.data, "color:green");
                                        console.log(jsonstring);
                                        var arr_new = angular.fromJson(jsonstring.data);

                                        for (var i = 0; i < arr_new.length; i++) {
                                            console.log("notification received :" + arr_new[i].title);
                                            var txt = '"id:"' + arr_new[i].id;
                                            console.log('txt => ' + txt);
                                            var arr_tmp = $filter('filter')(vm.notifications, { id: arr_new[i].id });
                                            console.log("arr_tmp");
                                            console.log(arr_tmp);
                                            if (arr_tmp.length == 0 && azdutils.isNotifDatelessOrEq(arr_new[i].date) == true) {
                                                vm.notifications.unshift(arr_new[i]);
                                                //console.log(vm.noy)
                                            }
                                            //arr_index.push(arr_new[i].index);
                                        }
                                        counterServerTimer = 2;

                                        /*                                         $http.post("http://www.syaqasafe.rf.gd/unmarknewest.php", { arr_index: angular.toJson(arr_index) })
                                                                                    .success(function (data, status, headers, config) {
                                                                                        console.log("%c" + data, "color: blue");
                                                                                    })
                                                                                    .error(function (data, status, headers, config) {
                                                                                        console.log("%cError while unmark newest notifications..", "color:darkred");
                                                                                    }); */

                                    }, function myError(response) {
                                        console.log("%cError while receiving notifications from server..", "color:darkred");

                                    });

                                }
                                else {
                                    counterServerTimer -= 1;
                                }
                            }

                        }, 10 * 1000);
                    }
                }
            }



            return vm;
        }

        return notificator();
    })