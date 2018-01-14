angular.module('starter')
    .factory('weatherator', function ($q) {


        var weatherator = function () {
            var vm = {};
            vm.apikey = "7cd68969b09174e65a20341eddaf5258";
            vm.url = "http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=" + vm.apikey;

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    vm.latitude = position.coords.latitude;
                    vm.longitude = position.coords.longitude;
                    console.log("Latitude :"+vm.latitude);
                    console.log("Longitude :"+vm.longitude);
                });
            }
            else {
                console.log("No data through IP geolocation..");
            }



            return vm
        }

        return weatherator();
    })