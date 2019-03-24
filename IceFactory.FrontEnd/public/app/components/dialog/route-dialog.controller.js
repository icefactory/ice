"use strict";

//--------------------------------------------------------------------------------//
//
// Unit Controller
//
//--------------------------------------------------------------------------------//
angular.module('IceFactory').controller("DialogRouteController", function ($rootScope, $scope, $state, $timeout, $uibModalInstance, $stateParams, $uibModal, notificationService, dialogService, routeService) {
    //------------------------------------------------------------------------------------------------
    //
    //
    // Variable for this controller
    //
    //
    //------------------------------------------------------------------------------------------------
    var selectData = {};
    var colDefine = [
        {"title": "รหัสสายรถ", "className": "text-center", "data": "route_id", "width": "80px", bSort: false},
        {"title": "ชื่อสายรถ", "data": "route_name"},
        {"title": "ชื่อพนักงาน1", "data": "transporter1_name"},
        {"title": "ชื่อพนักงาน2", "data": "transporter2_name"},

    ];
    var table = $('#tbData').DataTable();


    $('#tbData tbody').on('click', 'tr', function () {
        debugger;
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });

    $('#button').click(function () {
        table.row('.selected').remove().draw(false);
    });

    //------------------------------------------------------------------------------------------------
    //
    //
    // AngularJs Events
    //
    //
    //------------------------------------------------------------------------------------------------
    $uibModalInstance.rendered.then(function () {
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
                selectData = table.row('.selected').data();
            }
        });

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

        console.log(selectData);

        $uibModalInstance.close(selectData);
    };

    $scope.loadDataOptions = function () {
    };

});

