// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

  
  $ionicConfigProvider.views.transition('android');
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.anti-somnolence', {
      url: '/anti-somnolence',
      views: {
        'tab-anti-somnolence': {
          templateUrl: 'templates/tab-anti-somnolence.html',
          controller: 'AntiSomnolenceCtrl'
        }
      }
    })

  .state('tab.smart-notification', {
    url: '/smart-notification',
    views: {
      'tab-smart-notification': {
        templateUrl: 'templates/tab-smart-notification.html',
        controller: 'SmartNotificationCtrl'
      }
    }
  })

  .state('tab.safe-modes', {
    url: '/safe-modes',
    views: {
      'tab-safe-modes': {
        templateUrl: 'templates/tab-safe-modes.html',
        controller: 'SafeModesCtrl'
      }
    }
  })
  .state('tab.important-numbers', {
    url: '/important-numbers',
    views: {
      'tab-important-numbers': {
        templateUrl: 'templates/tab-important-numbers.html',
        controller: 'ImportantNumbersCtrl'
      }
    }
  })
  .state('tab.main', {
    url: '/main',
    views: {
      'tab-main': {
        templateUrl: 'templates/tab-main.html',
        controller: 'MainCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/main');

});
