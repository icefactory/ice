"use strict";

//--------------------------------------------------------------------------------//
//
// Unit Controller
//
//--------------------------------------------------------------------------------//
angular.module('IceFactory').controller("RouteController", function ($rootScope, $uibModal, $scope, $state, $timeout, notificationService, dialogService, routeService) {
    //------------------------------------------------------------------------------------------------
    //
    //
    // Variable for this controller
    //
    //
    //------------------------------------------------------------------------------------------------

    $scope.search = {
        all: "",
        code: "",
        name: "",
        nameLocal: "",
        status: ""
    };

    $rootScope.currentPage = {
        title: "ข้อมูลสายรถ",
    };

    var colDefine = [
        {"title": "รหัสสายรถ", "className": "text-center", "data": "route_id", "width": "80px", bSort: false},
        {"title": "ชื่อสายรถ", "data": "route_name"},
        {"title": "ชื่อพนักงาน1", "data": "transporter1_name"},
        {"title": "ชื่อพนักงาน2", "data": "transporter2_name"},
        {
            "width": "50px",
            "className": "text-center",
            bSortable: false,
            mRender: function (data, type, row, meta) {
                return '<div class="btn-group"><button  id="btnEdit" class="btn btn-xs btn-info" ><i class="ace-icon fa fa-pencil bigger-120"></i></button><button id="btnDel" class="btn btn-xs btn-danger" ng-click="showProduct();"><i class="ace-icon fa fa-trash-o bigger-120"></i></button></div>'
            }
        },
    ];
    var table = $('#tbData').DataTable({
        "paging": true,
        //"scrollX": true,
        //"scrollCollapse": true,
        //"scrollY": true,
        "destroy": true,
        "searching": true,
        "ordering": true,
        "processing": false,
        "serverSide": false,
        "columns": colDefine,
        "autoWidth": true,
        "data": [],
        "order": [[0, 'asc']]
    });

    $('#tbData tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });

    $('#tbData tbody').on('click', '#btnEdit', function () {
        var table = $('#tbData').DataTable();
        var data = table.row($(this).parents('tr')).data();
        var idx = table.row($(this).parents('tr')).index();
        scope.param = data;
        scope.action = "edit";
        //$scope.showDlgProduct()
    });
    //------------------------------------------------------------------------------------------------
    //
    //
    // AngularJs Events
    //
    //
    //------------------------------------------------------------------------------------------------
    $scope.$on("$viewContentLoaded", function (event) {
        var param = {};
        routeService.search(param).then(function (result) {
            if (result.length > 0) {

                $('#tbData').DataTable().clear().draw();
                $('#tbData').dataTable().fnAddData(result);
                $('#tbData').dataTable().fnDraw();
            }
        }, function (err) {
            console.log(err);
        })


    });

    $scope.$on("$destroy", function () {

    });


    //------------------------------------------------------------------------------------------------
    //
    //
    // Dialog Modal
    //
    //
    //------------------------------------------------------------------------------------------------
    let scope = $scope.$new();

    $scope.showDlgProduct = function (obj) {
        let modalDialog = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: "app/components/master/product/product-add-edit-dialog.html",
            controller: "DialogProductAddEditController",
            size: "lg",
            scope: scope,
            backdrop: "static",
            resolve: {
                model: function () {
                    return obj;
                }
            }
        });

        modalDialog.result.then(function (dialogResult) {
            if (dialogResult != null) {

                // Refresh ข้อมูลใน Grid ใหม่
            }
        });
    };

    //------------------------------------------------------------------------------------------------
    //
    //
    // Page Events
    //
    //
    //------------------------------------------------------------------------------------------------
    $scope.btnAddClicked = function () {
        $scope.showDlgProduct();
    }


    //------------------------------------------------------------------------------------------------
    //
    //
    // Private Function
    //
    //
    //------------------------------------------------------------------------------------------------


});

