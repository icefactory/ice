angular.module('admin.route', []).config(function ($stateProvider) {
    $stateProvider
        .state('product', {
            url: "/master/product",
            templateUrl: "app/components/master/product/product.html",
            controller: "ProductController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'IceFactory',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/services/master/product.service.js',
                            'app/components/master/product/product.controller.js',
                            'app/components/master/product/product-add-edit-dialog.controller.js',

                            'app/services/master/unit.service.js',
                        ]
                    });
                }]
            }
        })

        .state('unit', {
            url: "/master/unit",
            templateUrl: "app/components/master/unit/unit.html",
            controller: "UnitController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'IceFactory',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/services/master/unit.service.js',
                            'app/components/master/unit/unit.controller.js',
                            //'app/components/master/unit/unit-add-edit-dialog.controller.js'
                        ]
                    });
                }]
            }
        })

        .state('route', {
            url: "/master/route",
            templateUrl: "app/components/master/route/route.html",
            controller: "RouteController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'IceFactory',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/services/master/route.service.js',
                            'app/components/master/route/route.controller.js',
                        ]
                    });
                }]
            }
        })

        .state('customer', {
            url: "/master/customer",
            templateUrl: "app/components/master/customer/customer.html",
            controller: "CustomerController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'IceFactory',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/services/master/customer.service.js',
                            'app/components/master/customer/customer.controller.js'
                        ]
                    });
                }]
            }
        })
        .state('product_stock', {
            url: "/product_stock",
            templateUrl: "app/components/product_stock/product_stock.html",
            controller: "ProductStockController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'IceFactory',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/services/master/product.service.js',

                            //'app/services/master/unit.service.js',
                            'app/components/product_stock/product_stock.controller.js',
                            'app/components/product_stock/product_stock-dialog.controller.js',
                            'app/components/dialog/dialognumpad.controller.js',
                            'app/services/master/product_stock.service.js',


                        ]
                    });
                }]
            }
        })

        .state('requisition_forward', {
            url: "/requisition_forward",
            templateUrl: "app/components/requisition_forward/requisition_forward.html",
            controller: "RequisitionForwardController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'IceFactory',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/services/master/product.service.js',

                            //'app/services/master/unit.service.js',
                            'app/components/requisition_forward/requisition_forward.controller.js',
                            'app/services/requisition/requisition.service.js',
                            //'app/components/product_stock/product_stock-dialog.controller.js',
                            'app/components/dialog/dialognumpad.controller.js',
                            'app/services/master/route.service.js',


                        ]
                    });
                }]
            }
        })

        .state('requisition', {
            url: "/requisition",
            templateUrl: "app/components/requisition/requisition.html",
            controller: "RequisitionController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'IceFactory',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/services/master/product.service.js',

                            'app/components/dialog/route-dialog.controller.js',
                            'app/components/requisition/requisition.controller.js',
                            'app/services/requisition/requisition.service.js',
                            //'app/components/product_stock/product_stock-dialog.controller.js',
                            'app/components/dialog/dialognumpad.controller.js',
                            'app/services/master/route.service.js',


                        ]
                    });
                }]
            }
        })


        .state('return_requisition', {
            url: "/return_requisition",
            templateUrl: "app/components/return_requisition/return_requisition.html",
            controller: "ReturnRequisitionController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'IceFactory',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/services/master/product.service.js',

                            'app/components/dialog/route-dialog.controller.js',
                            'app/components/return_requisition/return_requisition.controller.js',
                            'app/services/return_requisition/return_requisition.service.js',
                            //'app/components/product_stock/product_stock-dialog.controller.js',
                            'app/components/dialog/dialognumpad.controller.js',
                            'app/services/master/route.service.js',


                        ]
                    });
                }]
            }
        })

        .state('sale_pos', {
            url: "/sale_pos",
            templateUrl: "app/components/sale_pos/sale_pos.html",
            controller: "SalePOSController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'IceFactory',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/services/master/product.service.js',

                            'app/components/dialog/route-dialog.controller.js',
                            'app/components/sale_pos/sale_pos.controller.js',
                            'app/services/sale_pos/sale_pos.service.js',
                            //'app/components/product_stock/product_stock-dialog.controller.js',
                            'app/components/dialog/dialognumpad.controller.js',
                            'app/services/master/route.service.js',,
                            'app/components/dialog/customer-dialog.controller.js',
                            'app/services/master/customer.service.js'


                        ]
                    });
                }]
            }
        })

        .state('ice_bucket', {
            url: "/ice_bucket",
            templateUrl: "app/components/ice_bucket/ice_bucket.html",
            controller: "IceBucketController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'IceFactory',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/services/master/product.service.js',

                            'app/components/dialog/route-dialog.controller.js',
                            'app/components/ice_bucket/ice_bucket.controller.js',
                            'app/services/ice_bucket/ice_bucket.service.js',
                            //'app/components/product_stock/product_stock-dialog.controller.js',
                            'app/components/dialog/dialognumpad.controller.js',
                            'app/services/master/route.service.js',,
                            'app/components/dialog/customer-dialog.controller.js',
                            'app/services/master/customer.service.js'


                        ]
                    });
                }]
            }
        })

        .state('users', {
            url: "/users",
            templateUrl: "app/components/authority/users/users.html",
            controller: "UsersController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'IceFactory',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/services/authority/users.service.js',
                            'app/components/authority/users/users.controller.js',

                        ]
                    });
                }]
            }
        })
});
