"use strict";

//--------------------------------------------------------------------------------//
//
// Product Controller
//
//--------------------------------------------------------------------------------//
angular.module('IceFactory').controller("RequisitionController", function ($compile, $rootScope, $filter, $uibModal, $scope, $state, $timeout, notificationService, dialogService, productService, requisitionService, routeService) {
    //------------------------------------------------------------------------------------------------
    //
    //
    // Variable for this controller
    //
    //
    //------------------------------------------------------------------------------------------------
    var dt = new Date();
    $scope.reqData = {
        requisition_id: 0,
        route_id: 0,
        route_name: "",
        round: 1,
        transporter1_name: "",
        transporter2_name: "",
        document_date: String(dt.getDate()).padStart(2, '0') + "/" + String((dt.getMonth() + 1)).padStart(2, '0') + "/" + dt.getFullYear(),
    };
    var newData = {
        requisition_id: 0,
        document_no: "",
        route_id: $scope.reqData.route_id,
        customer_flag: null,
        customer_id: null,
        sell_type: 1,
        requisition_status: 1,
        document_date: dt.getFullYear() + '-' + String((dt.getMonth() + 1)).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0'),
        transporter1_id: null,
        transporter2_id: null,
        round: 1,
        description: "",
        price_net: 0,
        status: "Y",
        requisition_type: "APR",
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
        title: "อนุมัติจ่ายสินค้า",
    };
    $scope.rowSelect = null;
    $scope.dataSelect = {};
    var colDefine = [
        {"title": "#", "className": "text-center", "data": "id", "width": "80px", bVisible: false},
        {"title": "รหัสสินค้า", "className": "text-center", "data": "product_id", "width": "80px", bSort: false},
        {"title": "ซื้อสินค้า", "className": "text-left", "data": "product_name"},
        {"title": "ขอเบิก", "width": "80px", "className": "text-center", "data": "req_forward_qty"},
        {
            "title": "จ่ายจำนวน",
            "width": "150px",
            "className": "text-center",
            //bSortable: false,
            mRender: function (data, type, row, meta) {
                var edit = '<div class="btn-group-xs btn-corner"><button id="btnSubtract" class="btn btn-danger"><i class="icon-only  ace-icon ace-icon fa fa-minus bigger-110"></i></button><button id="btnEdit" type="button" class="btn btn-white btn-pink btn-xs" style="width: 40px;">' + row.quantity + '</button><button id="btnPlus" class="btn btn-success"><i class="icon-only  ace-icon ace-icon fa fa-plus bigger-110"></i></button></div>';
                var display = '<div>' + row.quantity + '</div>';
                return (isDisplay) ? display : edit
            }
        }
    ]


    var table = $('#tdData').DataTable({
        "paging": false,
        "destroy": true,
        "searching": false,
        "ordering": false,
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

    $('#tdData tbody').on('click', '#btnEdit', function () {
        var table = $('#tdData').DataTable();
        var data = table.row($(this).parents('tr')).data();
        var idx = table.row($(this).parents('tr')).index();
        //console.log(data);
        scope.param = data;
        $scope.showDlgChangeItem(idx);
    });


    $('#tdData tbody').on('click', '#btnPlus', function () {
        var table = $('#tdData').DataTable();
        var data = table.row($(this).parents('tr')).data();
        var idx = table.row($(this).parents('tr')).index();
        //console.log(data);
        //if (data.quantity > 0) {
        data.quantity += 1;
        /*if (data.id < 0) {
         data.req_forward_qty = data.quantity;
         }*/
        $('#tdData').DataTable().row(idx).data(data).draw();
        //}
    });


    $('#tdData tbody').on('click', '#btnSubtract', function () {
        var table = $('#tdData').DataTable();
        var data = table.row($(this).parents('tr')).data();
        var idx = table.row($(this).parents('tr')).index();
        if (data.quantity > 0) {
            data.quantity -= 1;
            /*if (data.id < 0) {
             data.req_forward_qty = data.quantity;
             }*/
            $('#tdData').DataTable().row(idx).data(data).draw();
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
            debugger;
            if ($scope.reqData.route_name == "") {
                dialogService.messageDialog("แจ้งเตือน", "กรุณาเลือกสายรภ");
                return;
            }
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
                    var data = {
                        id: 0,
                        product_id: product_id,
                        product_name: product_name,
                        req_forward_qty: 0,
                        quantity: parseInt(dialogResult)
                    };
                    if (data.quantity > 0) {
                        var table = $('#tdData').DataTable();
                        $('#tdData').dataTable().fnAddData(data);
                        $('#tdData').dataTable().fnDraw();

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

                    var table = $('#tdData').DataTable();
                    var data = table.row(tbRowId).data();
                    //var idx = table.row(tbRowId).index();
                    data.quantity = parseInt(dialogResult);
                    $('#tdData').DataTable().row(tbRowId).data(data).draw();
                }
            }
        });
    };

    $scope.showDlgRoute = function () {
        let modalDialog = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: "app/components/dialog/route-dialog.html",
            controller: "DialogRouteController",
            size: "lg",
            scope: scopeChg,
            backdrop: "static",
            resolve: {
                model: function () {
                    return true;
                }
            }
        });

        modalDialog.result.then(function (dialogResult) {
            if (dialogResult != null) {


                $scope.reqData.route_id = dialogResult.route_id;
                $scope.reqData.route_name = dialogResult.route_name;
                $scope.reqData.transporter1_name = dialogResult.transporter1_name;
                $scope.reqData.transporter2_name = dialogResult.transporter2_name;

                newData.route_id = dialogResult.route_id;
                newData.route_name = dialogResult.route_name;
                newData.transporter1_id = dialogResult.transporter1_id;
                newData.transporter2_id = dialogResult.transporter2_id;
                loadDataReqRoute();
                loadDataReqProduct();
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
        //$('#tdData').DataTable().clear();
        //$('#tdData').DataTable().rows().draw();
        const rr = true;//dialogService.confirmDialog("ยืนยัน", "กรุณายืนยัน");
        if (rr == true) {
            $("li[style='display:none;']").each(function (li) {
                $(this).attr("style", "display:block;");
            });
            loadDataReqRoute();
            dialogService.messageDialog("แจ้งเดือน", "ล้างข้อมูลสำเร็จ");
        }
    }


    $scope.saveData = function () {
        var table = $('#tdData').DataTable();
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
                    //alert("Success");

                    dialogService.messageDialog("แจ้งเดือน", "บันทึกข้อมูลเบิกจ่ายสินค้าสำเร็จ");
                    //window.location.reload();
                    //initData();
                }
            }, function (err) {
                debugger;
                var sMsg = "";
                if (err.length > 0) {
                    err.forEach(function () {
                        sMsg += err.message;
                    });
                }
                alert(sMsg);
            })
    }

    var loadDataReqRoute = function () {
        var dt = new Date();
        var dataProduct = [];
        var objFilter = {
            requisition_id: $scope.reqData.requisition_id,
            route_id: $scope.reqData.route_id,
            round: $scope.reqData.round,
            document_date: $scope.document_date,
            requisition_type: "FRW"
        }
        requisitionService.initReqByRoute($scope.reqData.route_id)
            .then(function (response) {
                //console.log(response.result);

                if (response != null) {
                    var dataReq = response;
                    dataReq.requisition_type = "APR"; // บันทึกจ่ายสินค้า
                    $scope.reqData = dataReq;
                    newData = dataReq;
                    if (dataReq.requisition_id > 0) {
                        //isDisplay = true;
                        //$("#btnGrp").attr("style", "display:none;");
                    }
                    debugger;
                    loadDataReqProduct();
                } else {
                    newData
                }

            }, function (err) {
                console.log(err);
            });


    }

    var loadDataReqProduct = function () {

        $('#tdData').DataTable().clear().draw();

        if ($scope.reqData.requisition_id > 0) {
            var dt = new Date();

            var objFilter = {
                requisition_id: $scope.reqData.requisition_id,
                route_id: $scope.reqData.route_id,
                round: $scope.reqData.round,
                document_date: $scope.document_date,
                requisition_type: "FRW"
            }
            debugger;
            requisitionService.searchReqProduct(objFilter).then(function (responseDet) {

                //debugger;
                if (responseDet.result.length > 0) {
                    var dataProduct = responseDet.result;
                    //console.log(dataProduct);
                    var table = $('#tdData').DataTable();
                    //$('#tdData').DataTable().clear().draw();
                    $('#tdData').dataTable().fnAddData(dataProduct);
                    //$('#tdData').dataTable().fnDraw();

                    dataProduct.forEach(function (objData) {
                        $("#pickid_" + objData.product_id).attr("style", "display:none;");
                    });

                    table.on('order.dt search.dt', function () {
                        table.column(0, {search: 'applied', order: 'applied'}).nodes().each(function (cell, i) {
                            cell.innerHTML = i + 1;
                        });
                    }).draw();
                }
            }, function (err) {
                console.log(err);
            })
        }
    }


    var initImgProduct = function () {

        var param = {};
        productService.search(param).then(function (result) {
            if (result) {
                //console.log(result);
                result.forEach(function (data, index) {
                    if (data.product_type == 1) {

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


