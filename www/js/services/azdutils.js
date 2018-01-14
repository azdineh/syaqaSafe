angular.module('starter')
    .factory('azdutils', function ($q, $http,$filter) {


        var azdutils = function () {
            var vm = {}
            vm.urlsuffix = "/android_asset/www/";
            vm.getRandomInt = function (min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min)) + min;
            };

            /**
             * @param url like sound/shortsounds.json
             * @return array promise
             */
            vm.getSSfromJson = function (url) {
                var q = $q.defer();

                $http.get(vm.urlsuffix + url)
                    .then(function (res) {
                        q.resolve(res.data);
                    }, function (err) {
                        console.log("Error while getting resources..");
                        q.reject(err);
                    });

                return q.promise;
            };

            vm.isValIn = function (val, arr) {
                var flag = false;
                arr.forEach(function (element) {
                    if (element == val)
                        flag = true;
                }, this);
                return flag;
            }

            vm.currentMonthNumber = function () {
                return $filter('date')(Date.now(), 'M'); //Month in year (1-12)
            }

            //to compare the time have to be as HH:mm 
            vm.currentHHmm = function () {
                var HH = $filter('date')(Date.now(), 'HH'); //Hour in day, padded (00-23)
                var mm = $filter('date')(Date.now(), 'mm'); //Minute in hour, padded (00-59)
                return HH + ":" + mm;
            }




            return vm;
        }

        return azdutils();
    })