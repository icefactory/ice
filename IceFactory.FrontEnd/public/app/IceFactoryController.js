/* Setup App Main Controller */
IceFactory.controller('IceFactoryController', function ($scope, $uibModal, $rootScope, $state, $location, $window, localStorageService, notificationService) {
    $rootScope.language = new Language();

    $scope.error = "";
    let scope = $scope.$new();

    //------------------------------------------------------------------------------------------------
    //
    //
    // AngularJs Events
    //
    //
    //------------------------------------------------------------------------------------------------
    $scope.$on('$viewContentLoaded', function () {

    });

    //------------------------------------------------------------------------------------------------
    //
    //
    // KendoUi Configurations
    //
    //
    //------------------------------------------------------------------------------------------------
    $scope.notificationCenterOptions = notificationService.options;

    //------------------------------------------------------------------------------------------------
    //
    //
    // Private Function
    //
    //
    //------------------------------------------------------------------------------------------------
    //
    // Check user already login
    $scope.checkUserAlreadyLogin = function () {
        if ($scope.getAuthentication()) {
            if (!$rootScope.menus) {
                /*     userMenuService.getUserMenu().then(function (result) {
                             $rootScope.menus = result;
                         },
                         function (err) {
                             console.log(err);
                             notificationService.error($scope, err.displayMessage);
                         }
                     );*/
            }
        } else {
            $window.location.href = "login.html";
            //$state.go("System.login", {});
        }

    };

    $scope.getAuthentication = function () {
        $rootScope.authenticationData = localStorageService.get(authenticationStorage);

        return $rootScope.authenticationData;
    };

    $rootScope.canCreate = function () {
        //console.log($rootScope.authenticationData.selectedMenu.userRoleMenus );
        if ($rootScope.authenticationData.selectedMenu.userRoleMenus !== undefined) {
            return $rootScope.authenticationData.selectedMenu.userRoleMenus[0].canCreate;
        }

        if ($rootScope.authenticationData.selectedMenu) {
            return true;
        }

        return false;
    };

    $rootScope.canDelete = function () {
        ///console.log($rootScope.authenticationData.selectedMenu.userRoleMenus );
        if ($rootScope.authenticationData.selectedMenu.userRoleMenus !== undefined) {
            return $rootScope.authenticationData.selectedMenu.userRoleMenus[0].canDelete;
        }

        if ($rootScope.authenticationData.selectedMenu) {
            return true;
        }

        return false;
    };

    $rootScope.canUpdate = function () {
        //console.log($rootScope.authenticationData.selectedMenu);
        if ($rootScope.authenticationData.selectedMenu.userRoleMenus !== undefined) {
            return $rootScope.authenticationData.selectedMenu.userRoleMenus[0].canUpdate;
        }

        if ($rootScope.authenticationData.selectedMenu) {
            return true;
        }

        return false;
    };

    $rootScope.canApprove = function () {
        //console.log($rootScope.authenticationData.selectedMenu.userRoleMenus );
        if ($rootScope.authenticationData.selectedMenu.userRoleMenus !== undefined) {
            return $rootScope.authenticationData.selectedMenu.userRoleMenus[0].canApprove;
        }

        if ($rootScope.authenticationData.selectedMenu) {
            return true;
        }

        return false;
    };

    $rootScope.canPrint = function () {
        //console.log($rootScope.authenticationData.selectedMenu.userRoleMenus );
        if ($rootScope.authenticationData.selectedMenu.userRoleMenus !== undefined) {
            return $rootScope.authenticationData.selectedMenu.userRoleMenus[0].canPrint;
        }

        if ($rootScope.authenticationData.selectedMenu) {
            return true;
        }

        return false;
    };

    $scope.checkUserAlreadyLogin();

});