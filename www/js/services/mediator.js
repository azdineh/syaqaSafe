angular.module('starter')
    .factory('mediator', function ($q, $timeout, $interval, $http) {


        var urlsuffix = "/android_asset/www/";
        var getRandomInt = function (min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min;
        };

        /**
         * @param url like sound/shortsounds.json
         * @return array promise
         */
        var getSSfromJson = function (url) {
            var q = $q.defer();

            $http.get(urlsuffix + url)
                .then(function (res) {
                    q.resolve(res.data);
                }, function (err) {
                    console.log("Error while getting resources..");
                    q.reject(err);
                });

            return q.promise;
        };

        var mediator = function () {
            var vm = {}
            vm.media;
            vm.isPlaying = false;
            vm.ss = []; // short sound array

            vm.playOnePulse = function (delay, ssname, elm_id) {
                $timeout(function () {
                    var url = urlsuffix + "media/SS/" + ssname + ".mp3";
                    console.log(url);
                    vm.media = new Media(url,
                        function () {
                            //success , end of play record or stop
                            vm.isPlaying = false;
                            vm.media.release();
                        }, function (err) {
                            //error
                            console.log("error while playin a media" + err)
                            console.log(err);
                            vm.isPlaying = false;

                        }, function (mediaStatus) {
                            if (mediaStatus == 1) {
                                vm.isPlaying = true;
                                vm.cancelTimerAnim();
                                vm.animateit(elm_id);
                                console.log('starting..')
                            }
                            if (mediaStatus == 4) {
                                vm.isPlaying = false;
                            }
                        });
                    vm.media.setVolume('1.0');
                    vm.media.play();
                }, delay);
            }

            vm.launchPlayingPulses = function (elm_id) {
                getSSfromJson("media/shortsounds.json")
                    .then(function (arr) {
                        vm.ss = arr.shortsounds;

                        vm.timer = $interval(function () {
                            if (vm.isPlaying == false) {
                                var random_delay = getRandomInt(1000 * 1, 1000 * 3); // [3s,7s[
                                var random_index = getRandomInt(0, vm.ss.length);
                                var current_ss = vm.ss[random_index];
                                console.log('The next pulse in ' + random_delay + ' minutes');
                                vm.isPlaying = true;
                                vm.playOnePulse(random_delay, current_ss.name, elm_id);
                            }
                            console.log('Timer');
                        }, 1000);



                    }, function (err) {
                        console.log("error while getting json file");
                    });
            }

            vm.animateit = function (id) {

                var w = 0;
                var wcontainer = document.getElementById(id + '-cntr').offsetWidth;
                console.log(wcontainer);

                var t = $interval(function () {
                    var duration = Math.ceil(vm.media.getDuration());
                    if (duration > 0) {
                        $interval.cancel(t);
                        console.log("Duration :" + duration);
                        var n_iter = duration * 1000 / 50;
                        var w_step = wcontainer / n_iter;
                        vm.timeranim = $interval(function () {
                            w += w_step;
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
                console.log("Timer is stopped..");
            }


            return vm;
        }

        return mediator();
    })