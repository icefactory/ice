"use strict";

//--------------------------------------------------------------------------------//
//
// Product Controller
//
//--------------------------------------------------------------------------------//
angular.module('IceFactory').controller("DialogNumpadController", function ($rootScope, $scope, $state, $timeout, $uibModalInstance/*, $stateParams, $uibModal, notificationService, dialogService*/) {
    //------------------------------------------------------------------------------------------------
    //
    //
    // Variable for this controller
    //
    //
    //------------------------------------------------------------------------------------------------
    $scope.data = {
        num_field: 0
    };

    //------------------------------------------------------------------------------------------------
    //
    //
    // AngularJs Events
    //
    //
    //------------------------------------------------------------------------------------------------
    $uibModalInstance.rendered.then(function () {


    });
    //------------------------------------------------------------------------------------------------
    //
    //
    // Page Events
    //
    //
    //------------------------------------------------------------------------------------------------
    $scope.btnCancelClicked = function () {
        $uibModalInstance.close(null);
    };

    $scope.btnSaveClicked = function () {
        $uibModalInstance.close($scope.data.num_field);
        //return $scope.data.num_field;
    };

    $scope.loadDataOptions = function () {
    };


    $scope.pushNum = function (iNum) {
        $scope.data.num_field = parseInt($scope.data.num_field) == 0 ? iNum : $scope.data.num_field + "" + iNum;
    };

    $scope.pushDot = function () {
        $scope.data.num_field = $scope.data.num_field + ".0";
    };

    $scope.backSpace = function () {
        var ss = "" + $scope.data.num_field;
        //console.log(ss.length);
        $scope.data.num_field = parseInt(ss.length == 1 ? 0 : ss.substr(0, ss.length - 1)); //$scope.data.num_field.subString(0, $scope.data.num_field.length - 1);
    };
    $scope.subtract = function () {
        $scope.data.num_field = parseInt($scope.data.num_field) - 1;
    };
    $scope.plus = function () {
        $scope.data.num_field = parseInt($scope.data.num_field) + 1;
    };
    $scope.clearNum = function () {
        $scope.data.num_field = 0;
    };


});
