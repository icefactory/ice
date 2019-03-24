"use strict";

//--------------------------------------------------------------------------------//
//
// Product Controller
//
//--------------------------------------------------------------------------------//
angular.module('IceFactory').controller("ProductController", function ($rootScope, $filter, $uibModal, $scope, $state, $timeout, notificationService, dialogService, productService) {
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
        title: "ข้อมูลสินค้า",
    };

    var colDefine = [
        {
            "title": "รหัสสินค้า",
            "className": "text-center",
            "data": "product_id",
            "width": "80px",
            bSort: false
        },
        {
            "width": "50px",
            "className": "text-center",
            bSortable: false,
            mRender: function (data, type, row, meta) {
                return '<img src="' + row.img_path + '" style="width:100px; heigth: 100px;" ></img></div>'
            }
        },
        {"title": "ซื้อสินค้า", "className": "", "data": "product_name"},
        {
            "title": "ราคาหน้าโรงงาน",
            "className": "text-right ",
            "data": "price_in",
            render: $.fn.dataTable.render.number(',', '.', 2, '')
        },
        {
            "title": "ราคาจัดส่ง",
            "className": "text-right ",
            "data": "price_out",
            render: $.fn.dataTable.render.number(',', '.', 2, '')
        },
        {"title": "คงเหลือ", "data": "remain_amt", className: "text-right"},
        {
            "title": "หน่วย",
            "width": "100px",
            "className": "text-center hidden-xs hidden-sm hidden-md",
            "data": "unit_name",
        },
        {"title": "หน่วย", "className": "", "data": "unit_id", bVisible: false},

        {
            "width": "50px",
            "className": "text-center ",
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
        var data = table.row($(this).parents('tr')).data();
        var idx = table.row($(this).parents('tr')).index();
        //console.log(data);
        scope.param = data;
        scope.action = "edit";
        $scope.showDlgProduct()
    });

    $('#tbData tbody').on('click', '#btnDel', function () {
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
        productService.search(param).then(function (result) {
            if (result) {
                $('#tbData').DataTable().clear().draw();
                $('#tbData').dataTable().fnAddData(result);
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

