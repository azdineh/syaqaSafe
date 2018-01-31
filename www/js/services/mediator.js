angular.module('starter')
    .factory('mediator', function ($q, azdutils, $interval, $window, $timeout, $http) {



        var mediator = function () {
            var vm = {}
            vm.media;
            vm.isPlaying = false;
            vm.alreadyClosed = false;
            vm.notifications = [];
            vm.ss = [];

            vm.playSound = function (soundname, notification_flag, callBacki, callBackj) {

                if (soundname != null) {
                    var url = "";
                    if (notification_flag == false) {
                        url = azdutils.urlsuffix + "media/SS/" + soundname + ".mp3";
                    }
                    else {
                        url = azdutils.urlsuffix + "notifications/sounds/" + soundname + ".mp3";
                        //url = azdutils.urlsuffix + "notifications/sounds/nassiha4.mp3";
                    }

                    console.log(url);

                    vm.media = new Media(url,
                        function () {
                            //success , end of play record or stop
                            vm.isPlaying = false;
                            vm.media.release();
                            callBackj();
                        }, function (err) {
                            //error
                            console.log("error while playin a media" + err);
                            console.log(err);
                            //vm.media.release();
                            //vm.isPlaying = false;
                        }, function (mediaStatus) {
                            if (mediaStatus == 1) {
                                vm.isPlaying = true;
                                //vm.cancelTimerAnim();
                                //if (notification_flag == true)
                                vm.animateit();
                                console.log('starting..')
                            }
                            if (mediaStatus == 4) {
                                //vm.isPlaying = false;
                            }
                        });

                    vm.media.setVolume('0.9');
                    callBacki();
                    vm.alreadyClosed = false;
                    vm.media.play();
                }
                else {
                    // do something when not sound for a notification
                    //callBackj();
                }
            }

            vm.playNotification = function (notification, notification_flag, callBacki, callBackj) {
                var soundName = notification.soundName;
                var notif_delay = 4 * 1000;
                var notif_flag = notification_flag;
                if (soundName == null) {
                    soundName = "ish3ar";
                    notif_delay = 10 * 1000;
                }
                if (notification.isAntiSomnolenceNotif == true) {
                    notif_flag = false;
                }
                var antiSomnolence_flag = $window.localStorage['sqas.antiSsomnolenceEenabled'] ? angular.fromJson($window.localStorage['sqas.antiSsomnolenceEenabled']) : false;
                var isPlayit = false;

                if (notification.isAntiSomnolenceNotif == true) {
                    if (antiSomnolence_flag == true) {
                        isPlayit = true;
                    } else {
                        isPlayit = false;

                    }
                } else {
                    isPlayit = true;
                }

                if (isPlayit == true) {
                    vm.playSound('before_notif', false,
                        function () { },
                        function () {
                            vm.playSound(soundName, notif_flag, function () { callBacki() }, function () {
                                if (!vm.alreadyClosed) {
                                    $timeout(function () {
                                        vm.playSound('after_notif', false, function () { }, function () { });
                                        callBackj();
                                    }, notif_delay);
                                }
                            });
                        })
                }



            }

            /*             vm.stopSound = function (callBacki) {
                            vm.alreadyClosed = true;
                            vm.media.stop();
                            vm.playSound('after_notif', false, function () { }, function () { });
                            callBacki();
                        } */

            var isfirstTime = true;
            vm.launchAntiSomnolence = function (callBacki, callBackj) {

                if (vm.ss.length == 0) {
                    azdutils.getSSfromJson("media/shortsounds.json")
                        .then(function (arr) {
                            vm.ss = arr.shortsounds;
                            callBacki();

                        }, function (err) {
                            console.log("error while getting json file");
                        });
                }

                if (vm.ss.length > 0) {
                    var random_delay = azdutils.getRandomInt(30 * 1000, 120 * 1000); // [1.5min, 4min[ -1min
                    var random_index = azdutils.getRandomInt(0, vm.ss.length);
                    var randomf = random_delay;

                    if (isfirstTime == true) {
                        random_delay = 400;
                        randomf = 45 * 1000;
                        isfirstTime = false;
                    }

                    callBacki();

                    /*  vm.timerAntiSomnolence = $timeout(function () {
                         var antiSomnolenceNotif = {};
                         antiSomnolenceNotif.title = "";
                         antiSomnolenceNotif.text = "";
                         antiSomnolenceNotif.soundName = vm.ss[random_index].name;
                         antiSomnolenceNotif.imageName = null;
                         antiSomnolenceNotif.isAntiSomnolenceNotif = true;
                         antiSomnolenceNotif.delay = 45*1000;
                         callBackj(antiSomnolenceNotif);
                     }, 500); */

                    vm.timerAntiSomnolence = $timeout(function () {
                        var antiSomnolenceNotif = {};
                        antiSomnolenceNotif.title = "";
                        antiSomnolenceNotif.text = "";
                        antiSomnolenceNotif.soundName = vm.ss[random_index].name;
                        antiSomnolenceNotif.imageName = null;
                        antiSomnolenceNotif.isAntiSomnolenceNotif = true;
                        antiSomnolenceNotif.delay = randomf;
                        callBackj(antiSomnolenceNotif);
                    }, random_delay);
                }
            }

            vm.stopYimerAntiSomnolence = function () {
                $timeout.cancel(vm.timerAntiSomnolence);
            }



            vm.animateit = function () {
                var id = "sqas-barr";
                var w = 0;
                //var wcontainer = document.body.offsetWidth - 300;
                var wcontainer;

                var t = $interval(function () {

                    if (document.getElementById('sqas-barr-cntr')) {

                        wcontainer = document.getElementById('sqas-barr-cntr').offsetWidth;
                        console.log("wcontainer : " + wcontainer);

                        var duration = Math.ceil(vm.media.getDuration());
                        if (duration > 0 && wcontainer > 0) {
                            $interval.cancel(t);
                            console.log("Duration :" + duration);
                            var n_iter = duration * 1000 / 50;
                            var w_step = wcontainer / n_iter;
                            vm.timeranim = $interval(function () {
                                w += w_step;
                                if (document.getElementById(id))
                                    document.getElementById(id).style.width = w + 'px';
                            }, 50, n_iter);
                        }
                    }

                }, 100)

            }

            vm.cancelTimerAnim = function () {
                $interval.cancel(vm.cancelTimerAnim);
            }



            return vm;
        }

        return mediator();
    })