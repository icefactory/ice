"use strict";

//--------------------------------------------------------------------------------//
//
// Dialog Product Controller
//
//--------------------------------------------------------------------------------//
angular.module('IceFactory').controller("DialogProductAddEditController", function ($rootScope, $scope, $state, $timeout, $uibModalInstance, $stateParams, $uibModal, notificationService, dialogService, unitService,productService) {
    //------------------------------------------------------------------------------------------------
    //
    //
    // Variable for this controller
    //
    //
    //------------------------------------------------------------------------------------------------
    $scope.data = {
        product_id: 0,
        product_name: "",
        unit_id: 1,
    };

    //------------------------------------------------------------------------------------------------
    //
    //
    // AngularJs Events
    //
    //
    //------------------------------------------------------------------------------------------------
    $uibModalInstance.rendered.then(function () {

        unitService.getddl().then(function (result) {

            if ($scope.action === "edit") {
                $scope.data = $scope.param;
                console.log($scope.data);

            }
            else {
                $scope.data = {
                    product_id: 0,
                    product_name: "",
                    unit_id: 1
                }

            }

            $scope.dataType =  result;

        }, function (err) {
            console.log(err);
        });

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
        alert("save");

        console.log($scope.data);
        if($scope.action == "edit"){

            productService.update($scope.data).then(function (result) {
                //$scope.dataType = result ;
                console.log($scope.data);
                alert("success");

                // send data
                $uibModalInstance.close('hfdhg');
            }, function (err) {
                console.log(err);
            });
        }else{
            productService.insert($scope.data).then(function (result) {
                //$scope.dataType = result ;
                console.log($scope.data);
                alert("success");

                // send data
                $uibModalInstance.close();
            }, function (err) {
                console.log(err);
            });
        }
    };

    $scope.loadDataOptions = function () {
    };


});

