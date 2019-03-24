"use strict";

//--------------------------------------------------------------------------------//
//
// Product Controller
//
//--------------------------------------------------------------------------------//
angular.module('IceFactory').controller("UsersController", function ($rootScope, $filter, $uibModal, $scope, $state, $timeout, notificationService, dialogService, usersService) {
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
            "title": "รหัสผู้ใช้งาน", "className": "text-center", "data": "user_id",
            "width": "80px", bSort: false
        },
        {"title": "ชื่อผู้ใช้งาน", "className": "", //"data": "user_name" ,
            mRender: function (data, type, row, meta) {
            return row.user_name + ' ' + row.user_name
        } },
        {"title": "บัตรประชาชน", "className": "hidden-sm hidden-xs ", "data": "user_idcard"},
        {"title": "ที่อยู่", "className": "", "data": "address"},
        {"title": "เบอร์โทร", "className": "",// "data": "phone_no",
            mRender: function (data, type, row, meta) {
            return row.phone_no + (row.phone_no2 != "" ? ' ,' + row.phone_no2 : "")
        }},
        {
            "title": "วันที่เริ่มทำงาน", "className": "text-center hidden-sm hidden-xs ", //"data": "regis_date",
            render: $.fn.dataTable.moment("DD/MM/YYYY"),
            mRender: function (data, type, row, meta) {
                return row.user_startwork != null ? moment(row.user_startwork).format("DD/MM/YYYY") : ''
            }
        },
        {
            "title": "วันเกิด", "className": "text-center hidden-sm hidden-xs ", //"data": "borrow_date",
            render: $.fn.dataTable.moment('YYYY/MM/DD'),
            mRender: function (data, type, row, meta) {
                return row.birth_date != null ? moment(row.birth_date).format("DD/MM/YYYY") : ''
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
        usersService.search(param).then(function (reponse) {
            if (reponse.length > 0) {
                debugger;
                $('#tbData').DataTable().clear().draw();
                $('#tbData').dataTable().fnAddData(reponse);
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

