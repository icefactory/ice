"use strict";

//--------------------------------------------------------------------------------//
//
// Product Controller
//
//--------------------------------------------------------------------------------//
angular.module('IceFactory').controller("IceBucketController", function ($rootScope, $filter, $uibModal, $scope, $state, $timeout, notificationService, dialogService, ice_bucketService) {
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
        title: "ข้อมูลถังน้ำแข็ง",
    };

    var colDefine = [
        {
            "title": "รหัสถัง", "className": "text-center", "data": "bucketID",
            "width": "80px", bSort: false
        },
        {
            "title": "สถานะ", "className": "text-center ", "data": "regis_date",
            mRender: function (data, type, row, meta) {
                return row.bucket_status == 1 ? '<span class="label label-warning">ยืม</span>' : '<span class="label label-success">คืนแล้ว</span>'
            }
        },
        {"title": "หมายเลขถัง", "className": "", "data": "bucket_no"},
        {"title": "ชื่อลูกค้า", "className": "", "data": "customer_name"},
        {"title": "สายรถ", "className": "", "data": "route_name"},
        {"title": "พนักงานจัดส่ง", "className": "", "data": "route_name"},
        {
            "title": "วันที่บันทึก", "className": "text-center hidden-sm hidden-xs ", "data": "regis_date",
            render: $.fn.dataTable.moment("DD/MM/YYYY"),
            mRender: function (data, type, row, meta) {
                return row.regis_date != null ? moment(row.regis_date).format("DD/MM/YYYY") : ''
            }
        },
        {
            "title": "วันที่ยืม", "className": "text-center ", "data": "borrow_date",
            render: $.fn.dataTable.moment('YYYY/MM/DD'),
            mRender: function (data, type, row, meta) {
                return row.borrow_date != null ? moment(row.borrow_date).format("DD/MM/YYYY") : ''
            }
        },
        {
            "title": "วันที่กำหนดคืน", "className": "text-center hidden-sm hidden-xs ", "data": "returndue_date",
            render: $.fn.dataTable.moment("DD/MM/YYYY"),
            mRender: function (data, type, row, meta) {
                return row.returndue_date != null ? moment(row.returndue_date).format("DD/MM/YYYY") : ''
            }
        },
        {
            "width": "50px", "className": "text-center ", bSortable: false,
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
        "order": [[0, 'asc']],
        //"columnDefs": [ {
        //    targets: [6,7,8],
        //    render: $.fn.dataTable.render.moment( 'YYYY/MM/DD', 'Do MMM YY', 'fr' )
        //} ]
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
        //console.log(data);
        scope.param = data;
        scope.action = "edit";
        $scope.showDlgProduct()
    });

    $('#tbData tbody').on('click', '#btnDel', function () {
        var table = $('#tbData').DataTable();
        var data = table.row($(this).parents('tr')).data();
        var idx = table.row($(this).parents('tr')).index();
        productService.deleted(data.product_id).then(function (result) {
            alert(result);
        }, function (err) {
            console.log(err);
        });
        //console.log(data);
        //scope.param = data.product_id;
        //scope.action = "edit";
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
        ice_bucketService.search(param).then(function (reponse) {
            if (reponse.result.length > 0) {
                debugger;
                $('#tbData').DataTable().clear().draw();
                $('#tbData').dataTable().fnAddData(reponse.result);
                $('#tbData').dataTable().fnDraw();
            }
        }, function (err) {
            console.log(err);
        })

        $('th').each(function (idx) {
            $(this).removeClass("text-right");
            $(this).removeClass("text-left");
            //$(this).removeClass("bigger-300");
        });
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
        scope.action = "add";
        $scope.showDlgProduct();
    }


    //------------------------------------------------------------------------------------------------
    //
    //
    // Private Function
    //
    //
    //------------------------------------------------------------------------------------------------
    $scope.showProduct = function () {
        $scope.showDlgProduct();
    }

});

