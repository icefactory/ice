/***
 Metronic AngularJS App Main Script
 ***/

/* Metronic App */
let IceFactory = angular.module("IceFactory", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    "ngTouch",
    "ngAnimate",
    "ng-currency",
    "LocalStorageModule",
    "admin.route",
]);

let authenticationStorage = 'IceFactory.Data';
let version = '1.0.0';

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
IceFactory.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

//AngularJS v1.3.x workaround for old style controller declarition in HTML
IceFactory.config(['$controllerProvider', 'localStorageServiceProvider', function($controllerProvider, localStorageServiceProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();

    localStorageServiceProvider
        .setPrefix("IceFactory")
        .setStorageType("sessionStorage")
        .setNotify(true, true);
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
 *********************************************/

/* Setup global settings */
IceFactory.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    let settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layouts
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: 'assets',
        apiUrl: "http://localhost:5000/api/",
    };

    $rootScope.settings = settings;
    $rootScope.authenticationData = null;

    return settings;
}]);

//
// Add token in to http-header of every http request.
IceFactory.config(["$httpProvider", function ($httpProvider) {
    $httpProvider.interceptors.push(["localStorageService", function (localStorageService) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                config.timeout = 10000000;

                let authenticationData = localStorageService.get(authenticationStorage);

                if (authenticationData) {
                    let token = authenticationData.token;

                    if (token) {
                        config.headers.Authorization = "Bearer " + token;
                    }
                }

                return config;
            }
        };
    }]);
}]);

/***
 Layout Partials.
 By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial
 initialization can be disabled and Layout.init() should be called on page load complete as explained above.
 ***/
/* Setup Layout Part - Theme Panel */
IceFactory.controller('ThemePanelController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]);

/* Init global settings and run the app */
IceFactory.run(["$rootScope", "settings", "$state", "$stateParams", function($rootScope, settings, $state, $stateParams) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$stateParams = $stateParams;
    $rootScope.$settings = settings; // state to be accessed from view
    $rootScope.$version = version;
}]);
