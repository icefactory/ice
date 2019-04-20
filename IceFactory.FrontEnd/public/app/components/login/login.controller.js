/* Setup blank page controller */
angular.module('IceFactory').controller('LoginController', function ($rootScope, $scope, $window, localStorageService, notificationService, userService) {
    $scope.data = {
        username: "admin",
        password: "0085"
    };

    /*   $scope.changePassData = {
           currentPassword: "",
           newPassword: "",
           confirmPassword: ""
       };*/

    $scope.notificationCenterOptions = notificationService.options;
    $scope.notificationCenter = notificationService;

    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
    });


    $scope.logout = function () {
        dialogService.confirmDialog("คุณต้องการออกจากระบบหรือไม่", '', function (err, result) {
            if (result) {
                localStorageService.clearAll();
                $rootScope.authenticationData = null;
            }
        });
    };

    function displayLoading(target, status) {
        var element = $(target);
        //kendo.ui.progress(element, status);
    }


    //
    // Login
    $scope.btnSignInClicked = function () {

        displayLoading(document.body, true);

        if ($scope.data.username && $scope.data.password) {
            userService.login($scope.data.username, $scope.data.password).then(function (result) {
                console.log(result);
                /*return;*/
                //
                // set user authentication data
                $rootScope.authenticationData = {
                    token: result.accessToken,
                    user: result.user,
                };

                $rootScope.menus = result.menus;

                localStorageService.set(authenticationStorage, $rootScope.authenticationData);

                /* if ($rootScope.authenticationData.user.userExpired) {
                     notificationService.error($scope, "You don't have permission to access this application.");
 
                     logout();
                 } else {*/
                $window.location.href = "index.html";

                /* } */

                displayLoading(document.body, false);
            }, function (err) {
                notificationService.error($scope, err.displayMessage);
                displayLoading(document.body, false);
            });
        } else {

            notificationService.warning($scope, "Username and password can not be blank.");
            displayLoading(document.body, false);
        }
    };


    $scope.showLogin = function () {
        $("form[name='forgotForm']").hide();
        $("form[name='changePassForm']").hide();

        $("form[name='loginForm']").show();
    };

});
