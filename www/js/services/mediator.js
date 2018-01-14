angular.module('starter')
    .factory('mediator', function ($q, azdutils, $timeout, $interval, $http) {



        var mediator = function () {
            var vm = {}
            vm.media;
            vm.isPlaying = false;
            vm.ss = []; // short sound array

            vm.playOnePulse = function (delay, ssname, notification_flag, callBacki, callBackj) {
                vm.timer2 = $timeout(function () {
                    var url = "";
                    if (notification_flag == false) {
                        url = azdutils.urlsuffix + "media/SS/" + ssname + ".mp3";
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
                            //vm.media.stop();
                        }, function (mediaStatus) {
                            if (mediaStatus == 1) {
                                vm.isPlaying = true;
                                vm.cancelTimerAnim();
                                vm.animateit("sqas-barr");
                                console.log('starting..')
                            }
                            if (mediaStatus == 4) {
                                vm.isPlaying = false;
                            }
                        });
                    vm.media.setVolume('1.0');
                    vm.media.stop();
                    vm.media.release();
                    callBacki();
                    vm.media.play();


                }, delay);
            }

            //for anti-somnolence
            vm.launchPlayingPulses = function (callBacki, callBackj) {

                azdutils.getSSfromJson("media/shortsounds.json")
                    .then(function (arr) {
                        vm.ss = arr.shortsounds;

                        vm.timer = $interval(function () {
                            if (vm.isPlaying == false) {
                                var random_delay = azdutils.getRandomInt(10, 20); // [10s,20s[
                                var random_index = azdutils.getRandomInt(0, vm.ss.length);
                                var current_ss = vm.ss[random_index];
                                console.log('The next pulse in ' + random_delay + ' minutes');
                                vm.isPlaying = true;
                                vm.playOnePulse(random_delay * 1000, current_ss.name, false, callBacki, callBackj);
                            }
                            console.log('Timer');
                        }, 1000);



                    }, function (err) {
                        console.log("error while getting json file");
                    });
            }

            vm.animateit = function (id) {

                var w = 0;
                var wcontainer;
                if (document.getElementById('sqas-barr-cntr'))
                    wcontainer = document.getElementById('sqas-barr-cntr').offsetWidth;
                console.log("wcontainer : " + wcontainer);

                var t = $interval(function () {
                    var duration = Math.ceil(vm.media.getDuration());
                    if (duration > 0) {
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

                }, 100)
            }

            vm.cancelTimerAnim = function () {
                $interval.cancel(vm.cancelTimerAnim);
            }

            vm.cancelTimer = function () {

                if (vm.media) {
                    vm.media.stop();
                    console.log("stop playing..");
                }
                $interval.cancel(vm.timer);
                $timeout.cancel(vm.timer2);
                console.log("Timer is stopped..");
            }


            return vm;
        }

        return mediator();
    })