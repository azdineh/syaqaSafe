angular.module('starter')
    .factory('mediator', function ($q, azdutils, $interval, $http) {



        var mediator = function () {
            var vm = {}
            vm.media;
            vm.isPlaying = false;

            vm.playSound = function (soundname, notification_flag, callBacki, callBackj) {

                if (soundname != null) {
                    var url = "";
                    if (notification_flag == false) {
                        url = azdutils.urlsuffix + "media/SS/" + soundname + ".mp3";
                    }
                    else {
                        //url = azdutils.urlsuffix + "media/notifications/" + ssname + ".mp3";
                        url = azdutils.urlsuffix + "notifications/sounds/nassiha4.mp3";
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
                            vm.isPlaying = false;
                        }, function (mediaStatus) {
                            if (mediaStatus == 1) {
                                vm.isPlaying = true;
                                //vm.cancelTimerAnim();
                                if (notification_flag == true)
                                    vm.animateit();
                                console.log('starting..')
                            }
                            if (mediaStatus == 4) {
                                vm.isPlaying = false;
                            }
                        });

                    vm.media.setVolume('0.8');
                    callBacki();
                    vm.media.play();
                }
                else {
                    // do something when not sound for a notification
                }
            }

            vm.playNotification = function (notification, notification_flag, callBacki, callBackj) {
                vm.playSound('before_notif', false,
                    function () { },
                    function () {
                        console.log("tstt..");
                        vm.playSound(notification.soundName, notification_flag, function () { callBacki() }, function () {
                            vm.playSound('after_notif', false, function () { }, function () { });
                            callBackj();
                        });
                    })
            }

            vm.animateit = function () {
                var id = "sqas-barr";
                var w = 0;
                //var wcontainer = document.body.offsetWidth - 300;
                var wcontainer;

                var t = $interval(function () {

                    if (document.getElementById('sqas-barr-cntr'))
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
                        }, 50, n_iter+2);
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