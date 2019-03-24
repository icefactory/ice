/***
 Metronic AngularJS App Main Script
 ***/

/* Metronic App */
let IceFactory = angular.module(IceFactory, [
    "ui.router",
    "ngSanitize",
    "ngTouch",
    "ngAnimate",
    "LocalStorageModule"
]);

let authenticationStorage = 'IceFactory.Data';
let languageStorage = 'IceFactory.CurrentLanguage';

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

    return settings;
}]);

/* Init global settings and run the app */
IceFactory.run(["$rootScope", "settings", "$state", "$stateParams", function($rootScope, settings, $state, $stateParams) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$stateParams = $stateParams;
    $rootScope.$settings = settings; // state to be accessed from view
}]);