angular.module('starter')
    .factory('azdutils', function ($q, $http, $filter) {


        var azdutils = function () {
            var vm = {}
            vm.urlsuffix = "";
            if (ionic.Platform.isWebView()) {
                vm.urlsuffix = "/android_asset/www/";
            }
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


            /*             vm.currentDateIsDailyTo = function (shortdatenotif) {
                            var dd = parseInt($filter('date')(Date.now(), 'dd'));  //'dd': Day in month (01-31)
                            var ddnotif = parseInt(shortdatenotif.substring(0, 2));
                            var bool = false;
                            if (dd >= ddnotif) {
                                bool = true;
                            }
                            return bool;
                        }
                        vm.currentDateIsMonthlyTo = function (shortdatenotif) {
                            var MM = parseInt($filter('date')(Date.now(), 'MM'));  //'MM': Month in year, padded (01-12)
                            var MMnotif = parseInt(shortdatenotif.substring(3, 5));
                            var bool = false;
                            if (MM >= MMnotif) {
                                bool = true;
                            }
                            return bool;
                        }
                        vm.currentDateIsAnnualTo = function (shortdatenotif) {
                            var yyyy = parseInt($filter('date')(Date.now(), 'yyyy'));  //4 digit representation of year (e.g. AD 1 => 0001, AD 2010 => 2010)
                            var shortdatenotif2 = shortdatenotif + " ";
                            var yyyynotif = parseInt(shortdatenotif2.substring(6, 10));
                            var bool = false;
                            if (yyyy >= yyyynotif) {
                                bool = true;
                            }
                            return bool;
                        }
            
                        vm.currentDateIsEqualTo = function (shortdatenotif) {
                            var day = parseInt($filter('date')(Date.now(), 'dd'));
                            var month = parseInt($filter('date')(Date.now(), 'MM'));
                            var year = parseInt($filter('date')(Date.now(), 'yyyy'));
            
                            var dayNotif = parseInt(shortdatenotif.substring(0, 2));
                            var monthNotif = parseInt(shortdatenotif.substring(3, 5));
                            var shortdatenotif2 = shortdatenotif + " ";
                            var yearNotif = parseInt(shortdatenotif2.substring(6, 10));
            
                            var bool = false;
                            if (day == dayNotif && month == monthNotif && year == yearNotif) {
                                bool = true;
                            }
                            return bool;
                        } */

            vm.getPeriodicity = function (shortdatenotif) {
                //  25/01/2018
                var day = parseInt($filter('date')(Date.now(), 'dd'));
                var month = parseInt($filter('date')(Date.now(), 'MM'));
                var year = parseInt($filter('date')(Date.now(), 'yyyy'));

                var dayNotif = parseInt(shortdatenotif.substring(0, 2));
                var monthNotif = parseInt(shortdatenotif.substring(3, 5));
                var shortdatenotif2 = shortdatenotif + " ";
                var yearNotif = parseInt(shortdatenotif2.substring(6, 10));

                var perio = "";

                if (day >= dayNotif || day <= dayNotif) {
                    perio = "daily";
                }
                if (day == dayNotif && (month >= monthNotif || month <= monthNotif)) {
                    perio = "monthly";
                }
                if (day == dayNotif && month == monthNotif && (year >= yearNotif || year <= yearNotif)) {
                    perio = "annual";
                }


                if (day == dayNotif && month == monthNotif && year == yearNotif) {
                    perio = "onetime";
                }

                /*                 console.log("notif. date : " + shortdatenotif + " <> " + " current date :" + day + "/" + month + "/" + year);
                                console.log("Periodicity : " + perio) */
                return perio;
            }

            vm.isNotifWeatherConvenable = function (currentTemp, nTemp) {
                var bool = false;
                if (nTemp == "any") {
                    bool = true
                }
                if (nTemp == "hot" && parseInt(currentTemp) >= 31) {
                    bool = true;
                }
                if (nTemp == "cold" && parseInt(currentTemp) <= 15) {
                    bool = true;
                }
                if (nTemp == "normal" && parseInt(currentTemp) >= 16 && parseInt(currentTemp) <= 30) {
                    bool = true;
                }


                return bool;

            }

            vm.isNotifDatelessOrEq = function (shortdatenotif) {
                var bool = false;
                var day = parseInt($filter('date')(Date.now(), 'dd'));
                var month = parseInt($filter('date')(Date.now(), 'MM'));
                var year = parseInt($filter('date')(Date.now(), 'yyyy'));

                var dayNotif = parseInt(shortdatenotif.substring(0, 2));
                var monthNotif = parseInt(shortdatenotif.substring(3, 5));
                var shortdatenotif2 = shortdatenotif + " ";
                var yearNotif = parseInt(shortdatenotif2.substring(6, 10));

                if (day <= dayNotif && month <= monthNotif && year <= yearNotif) {
                    bool = true;
                }

                console.log("Notificatin date : " + dayNotif + "/" + monthNotif + "/" + yearNotif);
                console.log("current date : " + day + "/" + month + "/" + year);


                return bool;
            }




            return vm;
        }

        return azdutils();
    })