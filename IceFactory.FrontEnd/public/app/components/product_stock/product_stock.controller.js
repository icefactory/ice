"use strict";

//--------------------------------------------------------------------------------//
//
// Product Controller
//
//--------------------------------------------------------------------------------//
angular.module('IceFactory').controller("ProductStockController", function ($rootScope, $filter, $uibModal, $scope, $state, $timeout, notificationService, dialogService, productService, productStockService) {
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
        title: "การจัดการสินค้าคงเหลือ",
    };
    $scope.rowSelect = null;
    $scope.dataSelect = {};
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
        {"title": "จำนวนคงเหลือ", "className": "text-right", "data": "remain_amt",},
        {
            "title": "เพิ่มผลิต",
            /*"width": "50px",*/
            "className": "text-center",
            bSortable: false,
            mRender: function (data, type, row, meta) {
                return '<button type="button" id="btnAddAmt" class="btn btn-success  smaller-90"><i class="icon-only  ace-icon ace-icon fa fa-plus"></i> เพิ่มผลิต</button>'
            }
        },
        {
            "title": "เพิ่มจัดซื้อ",
            /*"width": "50px",*/
            "className": "text-center ",
            bSortable: false,
            mRender: function (data, type, row, meta) {
                return '<button type="button" id="btnPurchase" class="btn btn-primary smaller-90" ><i class="icon-only  ace-icon ace-icon fa fa-plus"></i> เพิ่มจัดซื้อ</button>'
            }
        },
        {
            "title": "หน่วย",
            "width": "100px",
            "className": "text-center hidden-xs hidden-sm hidden-md",
            "data": "unit_name"
        }, {"title": "หน่วย", "className": "text-center ", "data": "unit_id", bVisible: false},

        {"title": "หน่วย", "className": "text-center", "data": "unit_id", bVisible: false},

        {
            "width": "50px",
            "className": "text-center",
            bSortable: false,
            mRender: function (data, type, row, meta) {
                return '<div class="btn-group"><button  id="btnEdit" class="btn btn-xs btn-info" ><i class="ace-icon fa fa-search bigger-300"></i></button></div>'
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
        $scope.showDlgStockTrans()
    });


    $('#tbData tbody').on('click', '#btnAddAmt', function () {
        var data = table.row($(this).parents('tr')).data();
        var idx = table.row($(this).parents('tr')).index();
        //console.log(data);
        $scope.param = data;
        $scope.action = "STK";
        $scope.dataSelect = data;
        $scope.rowSelect = idx;
        $scope.showDlgProduct()
    });


    $('#tbData tbody').on('click', '#btnPurchase', function () {
        var data = table.row($(this).parents('tr')).data();
        var idx = table.row($(this).parents('tr')).index();
        //console.log(data);
        $scope.param = data;
        $scope.action = "PCH";
        $scope.dataSelect = data;
        $scope.rowSelect = idx;
        $scope.showDlgProduct()
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
            templateUrl: "app/components/dialog/dialognumpad.html",
            controller: "DialogNumpadController",
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
                console.log($scope.dataSelect);

                var dataAdd = $scope.dataSelect;
                dataAdd.item_amt = parseInt(dialogResult);
                dataAdd.from_action = $scope.action;
                if (dataAdd.item_amt > 0) {
                    fncInsertData(dataAdd);
                }
            }
        });
    };
    $scope.showDlgStockTrans = function (obj) {
        let modalDialog = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: "app/components/product_stock/product_stock_tran-dialog.html",
            controller: "DialogProductStockTranController",
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
                //console.log($scope.dataSelect);
                //
                //var dataAdd = $scope.dataSelect;
                //dataAdd.item_amt = parseInt(dialogResult);
                //if (dataAdd.item_amt > 0) {
                //    fncInsertData(dataAdd);
                //}
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
    var fncInsertData = function (objData) {
        var data = {product_id: objData.product_id, item_amt: objData.item_amt, from_action: objData.from_action};
        productStockService.insert(data)
            .then(function (response) {
                console.log(response);
                if (response.result != null) {
                    alert("Success");
                    $scope.dataSelect.remain_amt = response.result.remain_amt;
                    $('#tbData').DataTable().row($scope.rowSelect).data($scope.dataSelect).draw();
                }
            }, function (err) {
                console.log(err);
            })

    }

});

