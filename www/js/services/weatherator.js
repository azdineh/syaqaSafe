angular.module('starter')
    .factory('weatherator', function ($q, $http, $cordovaGeolocation, $cordovaNetwork, $window) {


        var weatherator = function () {
            var vm = {};
            vm.apikey = "7cd68969b09174e65a20341eddaf5258";
            //vm.apikey = "7cd68969b09174e65a20341eddaf5258";
            vm.city = ""
            vm.url = "";
            vm.coords = {};
            //vm.url = "http://api.openweathermap.org/data/2.5/weather?q=" + vm.city + ",ma&units=metric&lang=ar&APPID=" + vm.apikey;

            vm.getWeatherObj = function (coords, callback) {

                if (coords.latitude)
                    vm.url = "http://api.openweathermap.org/data/2.5/weather?lat=" + coords.latitude + "&lon=" + coords.longitude + "&units=metric&lang=ar&APPID=" + vm.apikey;
                else
                    vm.url = "http://api.openweathermap.org/data/2.5/weather?q=Rabat,ma&units=metric&lang=ar&APPID=" + vm.apikey;

                $http({
                    method: 'GET',
                    url: vm.url
                }).then(function successCallback(response) {
                    callback(response.data);
                }, function errorCallback(response) {
                    console.log("Error while getting info from weather..")
                    console.log(response);
                    var weatherObj = $window.localStorage['sqas.weatherObj'] ? angular.fromJson($window.localStorage['sqas.weatherObj']) : {};
                    callback(weatherObj);
                });
            }

            var posOptions = { timeout: 5000, maximumAge: 5 * 60 * 1000, enableHighAccuracy: false };
            vm.getPositions = function (callbacki, callbackj) {
                $cordovaGeolocation.getCurrentPosition(posOptions)
                    .then(function (position) {
                        callbacki(position.coords)
                    }, function (err) {
                        // error
                        console.log("Error while getting geo position..");
                        console.log(err);
                        callbackj();
                    });

                /*                 if (navigator.geolocation) {
                                    navigator.geolocation.getCurrentPosition(function (position) {
                                        callback(position.coords);
                                    });
                                } else {
                                    console.log("Geolocation is not supported by this browser.");
                                } */

            }

            /**
             * @returns weatherObj, if fallit return {}
             */
            vm.initWeather = function (callbacki) {
                if ($cordovaNetwork.isOnline()) {
                    vm.getPositions(function (coords) {

                        vm.coords.latitude = coords.latitude;
                        vm.coords.longitude = coords.longitude;

                        $window.localStorage['sqas.coords'] = angular.toJson(vm.coords);
                        console.log(" Coords : " + vm.coords.latitude + " -- " + vm.coords.longitude);
                        vm.getWeatherObj(coords, function (weatherObj) {
                            weatherObj.onGeo = true;
                            weatherObj.connected = true;
                            $window.localStorage['sqas.weatherObj'] = angular.toJson(weatherObj);
                            callbacki(weatherObj);
                        });
                    }, function () {
                        //get coord of rabat by default
                        console.log("Error while getting geo localisation.. try yo get coords of a default city");
                        var coords = $window.localStorage['sqas.coords'] ? angular.fromJson($window.localStorage['sqas.coords']) : {};
                        vm.getWeatherObj(coords, function (weatherObj) {
                            weatherObj.onGeo = false;
                            if (coords.latitude == null)
                                weatherObj.name = "--";
                            weatherObj.connected = true;
                            $window.localStorage['sqas.weatherObj'] = angular.toJson(weatherObj);
                            callbacki(weatherObj);
                        });
                    })
                } else {
                    var weatherObj = $window.localStorage['sqas.weatherObj'] ? angular.fromJson($window.localStorage['sqas.weatherObj']) : {};
                    weatherObj.onGeo = false;
                    weatherObj.connected = false;

                    callbacki(weatherObj);
                }
            }




            return vm
        }

        return weatherator();
    })


    /**
     * weatherObj :{
    "coord": {
        "lon": -0.13,
        "lat": 51.51
    },
    "weather": [
        {
            "id": 500,
            "main": "Rain",
            "description": "light rain",
            "icon": "10n"
        }
    ],
    "base": "cmc stations",
    "main": {
        "temp": 286.164,
        "pressure": 1017.58,
        "humidity": 96,
        "temp_min": 286.164,
        "temp_max": 286.164,
        "sea_level": 1027.69,
        "grnd_level": 1017.58
    },
    "wind": {
        "speed": 3.61,
        "deg": 165.001
    },
    "rain": {
        "3h": 0.185
    },
    "clouds": {
        "all": 80
    },
    "dt": 1446583128,
    "sys": {
        "message": 0.003,
        "country": "GB",
        "sunrise": 1446533902,
        "sunset": 1446568141
    },
    "id": 2643743,
    "name": "London",
    "cod": 200
}
     */