angular.module('starter')
    .factory('weatherator', function ($q, $http) {


        var weatherator = function () {
            var vm = {};
            vm.apikey = "7cd68969b09174e65a20341eddaf5258";
            //vm.apikey = "7cd68969b09174e65a20341eddaf5258";
            vm.city = "Rabat"
            vm.url = "http://api.openweathermap.org/data/2.5/weather?q=" + vm.city + ",ma&units=metric&lang=ar&APPID=" + vm.apikey;

            vm.getWeatherObj = function (callback) {
                $http({
                    method: 'GET',
                    url: vm.url,
                }).then(function successCallback(response) {
                    callback(response.data);
                }, function errorCallback(response) {
                    console.log("Error while getting info from weather..")
                    console.log(response);
                });
            }


            return vm
        }

        return weatherator();
    })


    /**
     * {
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