"use strict";

//--------------------------------------------------------------------------------//
//
// Product Controller
//
//--------------------------------------------------------------------------------//
angular.module('IceFactory').controller("RequisitionForwardController", function ($compile, $rootScope, $filter, $uibModal, $scope, $state, $timeout, notificationService, dialogService, productService, requisitionService, routeService) {
    //------------------------------------------------------------------------------------------------
    //
    //
    // Variable for this controller
    //
    //
    //------------------------------------------------------------------------------------------------
    var lstProduct = [];
    var lstPackage = [];

    var dt = new Date();
    $scope.reqData = {
        requisition_id: null,
        route_id: 3,
        route_name: "",
        round: 1,
        transporter1_name: "",
        transporter2_name: "",
        document_date: String(dt.getDate()).padStart(2, '0') + "/" + String((dt.getMonth() + 1)).padStart(2, '0') + "/" + dt.getFullYear(),
    }
    var newData = {
        requisition_id: 0,
        document_no: "",
        route_id: $scope.reqData.route_id,
        customer_flag: null,
        customer_id: null,
        sell_type: 1,
        requisition_status: 1,
        document_date: dt.getFullYear() + '-' + String((dt.getMonth() + 1)).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0'),
        transporter1_id: 3,
        transporter2_id: 13,
        round: $scope.reqData.round,
        description: "",
        price_net: 0,
        status: "Y",
        requisition_type: "FRW",
        ModifyByUserId: 1

    };
    $scope.document_date = $scope.reqData.document_date;
    var isDisplay = false;


    $scope.search = {
        all: "",
        code: "",
        name: "",
        nameLocal: "",
        status: ""
    };

    $rootScope.currentPage = {
        title: "การเบิกสินค้าล่วงหน้า",
    };
    $scope.rowSelect = null;
    $scope.dataSelect = {};

    var colDefine = [
        {"title": "รหัสสินค้า", "className": "text-center", "data": "product_id", "width": "80px", bVisible: false},
        //{"title": "ซื้อสินค้า", "className": "text-left", "data": "product_name", "width": "280px"},
        {
            "title": "ซื้อสินค้า", "className": "text-left",// "data": "product_name",
            mRender: function (data, type, row, meta) {
                return '<div style="">' + row.product_name + '<span class=" pull-right">' + ((row.package_name == null) ? "" : row.package_name) + '</span></div>';
            }
        },
        //{"title": "quantity", "className": "text-center", "data": "quantity" ,"width": "50px"},
        //{"title": "price", "className": "text-center", "data": "price" ,"width": "50px"},
        {
            "title": "จำนวน",
            "width": "100px",
            "className": "text-center",
            bSortable: false,
            mRender: function (data, type, row, meta) {
                var edit = '<div class="btn-group-xs btn-corner"><button id="btnSubtract" class="btn btn-danger"><i class="icon-only  ace-icon ace-icon fa fa-minus bigger-110"></i></button><button id="btnEdit" type="button" class="btn btn-white btn-pink btn-xs" style="width: 40px;">' + row.req_forward_qty + '</button><button id="btnPlus" class="btn btn-success"><i class="icon-only  ace-icon ace-icon fa fa-plus bigger-110"></i></button></div>';
                var display = '<div>' + row.req_forward_qty + '</div>';
                return (isDisplay) ? display : edit;
            }
        },
    ];

    var table = $('#tbData').DataTable({
        "paging": false,
        "destroy": true,
        "searching": false,
        "ordering": false,
        "processing": false,
        "serverSide": false,
        "columns": colDefine,
        //"autoWidth": true,
        "data": [],
        "order": [[0, 'asc']],
        "bLength": false,
        "bInfo": false,
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
        $scope.showDlgChangeItem(idx);
    });


    $('#tbData tbody').on('click', '#btnPlus', function () {
        var table = $('#tbData').DataTable();
        var data = table.row($(this).parents('tr')).data();
        var idx = table.row($(this).parents('tr')).index();
        //console.log(data);
        //if (data.quantity > 0) {
        data.req_forward_qty += 1;

        data.quantity = data.req_forward_qty;

        $('#tbData').DataTable().row(idx).data(data).draw();
        //}
    });


    $('#tbData tbody').on('click', '#btnSubtract', function () {
        var table = $('#tbData').DataTable();
        var data = table.row($(this).parents('tr')).data();
        var idx = table.row($(this).parents('tr')).index();
        if (data.req_forward_qty > 0) {
            data.req_forward_qty -= 1;
            data.quantity = data.req_forward_qty;

            $('#tbData').DataTable().row(idx).data(data).draw();
        }
    });
    //------------------------------------------------------------------------------------------------
    //
    //
    // AngularJs Events
    //
    //
    //------------------------------------------------------------------------------------------------
    $scope.$on("$viewContentLoaded", function (event) {
        initImgProduct();
        initData();


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
    $scope.showDlgNumpad = function (product_id, product_name) {
        if (isDisplay == false) {
            let modalDialog = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: "app/components/dialog/dialognumpad.html",
                controller: "DialogNumpadController",
                size: "lg",
                scope: scope,
                backdrop: "static",
                resolve: {
                    model: function () {
                        return product_id;
                    }
                }
            });

            modalDialog.result.then(function (dialogResult) {
                if (dialogResult != null) {

                    var objProduct = _.head(_.filter(lstProduct, {'product_id': product_id}));
                    var objPackage = _.head(_.filter(lstProduct, {'product_id': objProduct.item_id})); // get first element
                    var data = {
                        id: 0,
                        product_id: objProduct.product_id,
                        product_name: objProduct.product_name,
                        quantity: 0,
                        req_forward_qty: parseInt(dialogResult),
                        unit_name: objProduct.unit_name,
                        package_name: (objPackage != null ? "(" + objPackage.product_name + ")" : "")
                    };

                    //var data = {
                    //    product_id: product_id,
                    //    product_name: product_name,
                    //    quantity: parseInt(dialogResult),
                    //    req_forward_qty: parseInt(dialogResult)
                    //};
                    if (data.req_forward_qty > 0) {
                        var table = $('#tbData').DataTable();
                        $('#tbData').dataTable().fnAddData(data);
                        $('#tbData').dataTable().fnDraw();

                        debugger;
                        $("#pickid_" + product_id).attr("style", "display:none;")
                    }
                }
            });
        }
    };
    let scopeChg = $scope.$new();
    $scope.showDlgChangeItem = function (tbRowId) {
        let modalDialog = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: "app/components/dialog/dialognumpad.html",
            controller: "DialogNumpadController",
            size: "lg",
            scope: scopeChg,
            backdrop: "static",
            resolve: {
                model: function () {
                    return tbRowId;
                }
            }
        });

        modalDialog.result.then(function (dialogResult) {
            if (dialogResult != null) {
                // Refresh ข้อมูลใน Grid ใหม่
                if (parseInt(dialogResult) > 0) {

                    var table = $('#tbData').DataTable();
                    var data = table.row(tbRowId).data();
                    //var idx = table.row(tbRowId).index();
                    data.quantity = parseInt(dialogResult);
                    data.req_forward_qty = parseInt(dialogResult);
                    $('#tbData').DataTable().row(tbRowId).data(data).draw();
                }
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

    $scope.pageClear = function () {
        //location.reload();
        //$('#tbData').DataTable().clear();
        //$('#tbData').DataTable().rows().draw();
        loadDataReqProduct();
        //dialogService.messageDialog("title", "test message") ;
    }


    $scope.saveData = function () {

        var table = $('#tbData').DataTable();
        var data = table.rows().data().toArray();
        var postData = {
            _master: newData,
            _lstProducts: data,
        }
        console.log(postData);
        requisitionService.saveData(postData)
            .then(function (response) {
                console.log(response);
                if (response.result != null) {

                    dialogService.messageDialog("แจ้งเดือน", "บันทึกข้อมูลเบิกสินค้าล่วงหน้า สำเร็จ");
                    initData();
                }
            }, function (err) {
                console.log(err);
            })
    }

    var initData = function () {

        var dt = new Date();

        var objFilter = {
            requisition_id: $scope.reqData.requisition_id,
            route_id: $scope.reqData.route_id,
            round: $scope.reqData.round,
            document_date: $scope.document_date,
        }
        requisitionService.searchReq(objFilter)
            .then(function (response) {
                //console.log(response.result);
                var dataProduct = [];
                debugger;
                var dataReq;
                if (response.result.length > 0) {
                    dataReq = JSON.parse(JSON.stringify(response.result[0]));
                    $scope.reqData = dataReq;
                    //console.log($scope.reqData);
                    isDisplay = true;
                    debugger;
                    $("#btnGrp").attr("style", "display:none;");
                    objFilter.requisition_id = dataReq.requisition_id;

                    loadDataReqProduct();
                }
                else {
                    var param = objFilter;
                    routeService.search(objFilter).then(function (result) {

                        debugger;
                        if (result.length > 0) {
                            var data = JSON.parse(JSON.stringify(result[0]));

                            $scope.reqData.route_name = data.route_name;
                            $scope.reqData.transporter1_name = data.transporter1_name;
                            $scope.reqData.transporter2_name = data.transporter2_name;

                            newData.transporter1_id = data.transporter1_id;
                            newData.transporter2_id = data.transporter2_id;

                        }
                    }, function (err) {
                        console.log(err);
                    })
                }

            }, function (err) {
                console.log(err);
            })
    }


    var loadDataReqProduct = function () {
        var dt = new Date();
        var objFilter = {
            requisition_id: $scope.reqData.requisition_id,
            route_id: $scope.reqData.route_id,
            round: $scope.reqData.round,
            document_date: $scope.document_date,
        };

        requisitionService.searchReqProduct(objFilter).then(function (responseDet) {

            //debugger;
            if (responseDet.result.length > 0) {
                var dataProduct = responseDet.result;
                //console.log(dataProduct);
                var table = $('#tbData').DataTable();
                $('#tbData').DataTable().clear().draw();
                $('#tbData').dataTable().fnAddData(dataProduct);
                $('#tbData').dataTable().fnDraw();


                dataProduct.forEach(function (objData) {
                    $("#pickid_" + objData.product_id).attr("style", "display:none;");
                });
            }
        }, function (err) {
            console.log(err);
        })
    }

    var initImgProduct = function () {

        var param = {};
        productService.search(param).then(function (result) {
            if (result) {
                lstProduct = result;
                var lstImgProduct = _.filter(lstProduct, {'product_type': 1});
                var lstImgPackage = _.filter(lstProduct, {'product_type': 2});

                //console.log(result);
                lstImgProduct.forEach(function (data, index) {
                    if (data.product_type == 1 && data.type_id != 0) {

                        var li = $('<li id="pickid_' + data.product_id + '"></li>');
                        var tagA = $('<a ng-click="showDlgNumpad(' + data.product_id + ',\'' + data.product_name + '\');" data-rel="colorbox" class="cboxElement"></a>');
                        var pickImg = $('<img width="130" height="130" alt="150x150" src="' + data.img_path + '">');
                        var pickTxt = $('<div class="text"><div class="inner">' + data.product_name + '</div></div>');

                        tagA.append([pickImg, pickTxt]);
                        li.append(tagA);
                        $("#boxPickProduct").append(li);
                    }
                });
                var temp = $compile($("#boxPickProduct"))($scope);
            }
        }, function (err) {
            console.log(err);
        })

    }
});

