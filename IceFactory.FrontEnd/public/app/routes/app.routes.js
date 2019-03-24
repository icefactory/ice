
IceFactory.config(function ($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/dashboard");

    // $urlRouterProvider.otherwise(function ($injector, $location) {
    //     let $state = $injector.get('$state');
    //
    //     $state.go("SiamEast.dashboard", {});
    // });

    $stateProvider
        .state('dashboard', {
            url: "/dashboard",
            templateUrl: "app/components/dashboard/dashboard.html",
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'IceFactory',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'assets/global/plugins/morris/morris.css',
                            'assets/global/plugins/morris/morris.min.js',
                            'assets/global/plugins/morris/raphael-min.js',
                            'assets/global/plugins/jquery.sparkline.min.js',

                            'app/components/dashboard/dashboard.controller.js',
                        ]
                    });
                }]
            }
        })

});
