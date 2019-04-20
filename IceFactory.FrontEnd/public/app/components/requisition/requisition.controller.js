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
    var lstProduct = [];
    var lstPackage = [];

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

    $rootScope.currentPage = {
        title: "อนุมัติจ่ายสินค้า",
    };
    $scope.pickList = {
        productCount: 0,
        packageCount: 0,
    }
    $scope.rowSelect = null;
    $scope.dataSelect = {};

    /*
     *  tb Product
     * */

    var colDefine = [
        {"title": "#", "className": "text-center", "data": "id", "width": "80px", bVisible: false},
        {"title": "รหัสสินค้า", "className": "text-center", "data": "product_id", "width": "80px", bVisible: false},
        {
            "title": "ซื้อสินค้า", "className": "text-left",// "data": "product_name",
            mRender: function (data, type, row, meta) {
                return '<div style="">' + row.product_name + '<span class=" pull-right">' + ((row.package_name == null) ? "" : row.package_name) + '</span></div>';
            }
        },
        {"title": "ขอเบิก", "width": "80px", "className": "text-center", "data": "req_forward_qty"},
        {
            "title": "จ่ายจำนวน",
            "width": "150px",
            "className": "text-center",
            //bSortable: false,
            mRender: function (data, type, row, meta) {
                var edit = '<div class="btn-group-xs btn-corner pull-left"><button id="btnSubtract" class="btn btn-danger"><i class="icon-only  ace-icon ace-icon fa fa-minus bigger-110"></i></button><button id="btnEdit" type="button" class="btn btn-white btn-pink btn-xs" style="width: 40px;">' + row.quantity + '</button><button id="btnPlus" class="btn btn-success"><i class="icon-only  ace-icon ace-icon fa fa-plus bigger-110"></i></button></div>';
                var display = '<div class=" pull-left">' + row.quantity + '</div>';
                return ((isDisplay) ? display : edit) + '<span class="pull-right">' + row.unit_name + '</span>'
            }
        }
    ]

    var table = $('#tbProduct').DataTable({
        "paging": false,
        "destroy": true,
        "searching": false,
        "ordering": false,
        "processing": false,
        "serverSide": false,
        "columns": colDefine,
        "autoWidth": true,
        "data": [],
        "order": [[0, 'asc']],
        "bLength": false,
        "bInfo": false,
    });

    $('#tbProduct tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });

    $('#tbProduct tbody').on('click', '#btnEdit', function () {
        //var table = $('#tbProduct').DataTable();
        var data = table.row($(this).parents('tr')).data();
        var idx = table.row($(this).parents('tr')).index();
        //console.log(data);
        scope.param = data;
        $scope.showDlgChangeItem(idx);

        //table.on('order.dt search.dt', function () {
        //    table.column(0, {search: 'applied', order: 'applied'}).nodes().each(function (cell, i) {
        //        cell.innerHTML = i + 1;
        //    });
        //}).draw();
    });


    $('#tbProduct tbody').on('click', '#btnPlus', function () {
        //var table = $('#tbProduct').DataTable();
        var data = table.row($(this).parents('tr')).data();
        var idx = table.row($(this).parents('tr')).index();
        //console.log(data);
        //if (data.quantity > 0) {
        data.quantity += 1;
        /*if (data.id < 0) {
         data.req_forward_qty = data.quantity;
         }*/
        $('#tbProduct').DataTable().row(idx).data(data).draw();
        //}
    });


    $('#tbProduct tbody').on('click', '#btnSubtract', function () {
        //var table = $('#tbProduct').DataTable();
        var data = table.row($(this).parents('tr')).data();
        var idx = table.row($(this).parents('tr')).index();
        if (data.quantity > 0) {
            data.quantity -= 1;
            /*if (data.id < 0) {
             data.req_forward_qty = data.quantity;
             }*/
            $('#tbProduct').DataTable().row(idx).data(data).draw();
        }
    });


    /*
     * tb Package
     *
     * */


    var colDefinePKG = [
        {"title": "id", "className": "text-center", "data": "id", "width": "80px", bVisible: false},
        {"title": "รหัส", "className": "text-center", "data": "product_id", "width": "80px", bVisible: false},
        {"title": "ชื่อบรรจุภัณฑ์", "className": "text-left", "data": "product_name"},
        //{"title": "ขอเบิก", "width": "80px", "className": "text-center", "data": "req_forward_qty"},
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

    var tablePKG = $('#tbPackage').DataTable({
        "paging": false,
        "destroy": true,
        "searching": false,
        "ordering": false,
        "processing": false,
        "serverSide": false,
        "columns": colDefinePKG,
        "autoWidth": true,
        "data": [],
        "order": [[0, 'asc']],
        "bLength": false,
        "bInfo": false,
    });

    $('#tbPackage tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            tablePKG.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });

    $('#tbPackage tbody').on('click', '#btnEdit', function () {
        //var table = $('#tbPackage').DataTable();
        var data = tablePKG.row($(this).parents('tr')).data();
        var idx = tablePKG.row($(this).parents('tr')).index();
        //console.log(data);
        scope.param = data;
        openDlgNumpad().result.then(function (dialogResult) {
            if (dialogResult != null) {
                var data = {
                    id: 0,
                    product_id: product_id,
                    product_name: product_name,
                    req_forward_qty: 0,
                    quantity: parseInt(dialogResult)
                };
                if (data.quantity > 0) {
                    //debugger;
                    //var table = $('#tbProduct').DataTable();
                    tablePKG.dataTable().fnAddData(data);
                    tablePKG.dataTable().fnDraw();

                    $("#pickPackageId_" + product_id).attr("style", "display:none;")

                    //table.on('order.dt search.dt', function () {
                    //    table.column(0, {search: 'applied', order: 'applied'}).nodes().each(function (cell, i) {
                    //        cell.innerHTML = i + 1;
                    //    });
                    //}).draw();
                }
            }
        });
    });


    $('#tbPackage tbody').on('click', '#btnPlus', function () {
        //var tablePKG = $('#tbPackage').DataTable();
        var data = tablePKG.row($(this).parents('tr')).data();
        var idx = tablePKG.row($(this).parents('tr')).index();
        //console.log(data);
        //if (data.quantity > 0) {
        data.quantity += 1;
        /*if (data.id < 0) {
         data.req_forward_qty = data.quantity;
         }*/
        $('#tbPackage').DataTable().row(idx).data(data).draw();
        //}
    });


    $('#tbPackage tbody').on('click', '#btnSubtract', function () {
        //var table = $('#tbPackage').DataTable();
        var data = tablePKG.row($(this).parents('tr')).data();
        var idx = tablePKG.row($(this).parents('tr')).index();
        if (data.quantity > 0) {
            data.quantity -= 1;
            /*if (data.id < 0) {
             data.req_forward_qty = data.quantity;
             }*/
            $('#tbPackage').DataTable().row(idx).data(data).draw();
        }
    });


    //jquery tabs
    //$("#tabs").tabs();
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
    $scope.pickPackage = function (product_id, product_name) {
        if (isDisplay == false) {
            if ($scope.reqData.route_name == "") {
                dialogService.messageDialog("แจ้งเตือน", "กรุณาเลือกสายรภ");
                return;
            }
            openDlgNumpad().result.then(function (dialogResult) {
                if (dialogResult != null) {
                    var data = {
                        id: 0,
                        product_id: product_id,
                        product_name: product_name,
                        req_forward_qty: 0,
                        quantity: parseInt(dialogResult)
                    };
                    if (data.quantity > 0) {
                        //var table = $('#tbProduct').DataTable();
                        $('#tbPackage').dataTable().fnAddData(data);
                        $('#tbPackage').dataTable().fnDraw();

                        $("#pickPackageId_" + product_id).attr("style", "display:none;")

                        $("#packageCount").html(tablePKG.rows().count());
                        //table.on('order.dt search.dt', function () {
                        //    table.column(0, {search: 'applied', order: 'applied'}).nodes().each(function (cell, i) {
                        //        cell.innerHTML = i + 1;
                        //    });
                        //}).draw();
                    }
                }
            });
        }
    };
    $scope.pickProduct = function (product_id, product_name) {
        if (isDisplay == false) {
            if ($scope.reqData.route_name == "") {
                dialogService.messageDialog("แจ้งเตือน", "กรุณาเลือกสายรภ");
                return;
            }
            openDlgNumpad().result.then(function (dialogResult) {
                if (dialogResult != null) {


                    var objProduct = _.head(_.filter(lstProduct, {'product_id': product_id}));
                    var objPackage = _.head(_.filter(lstProduct, {'product_id': objProduct.item_id})); // get first element
                    var data = {
                        id: 0,
                        product_id: objProduct.product_id,
                        product_name: objProduct.product_name,
                        req_forward_qty: 0,
                        quantity: parseInt(dialogResult),
                        unit_name: objProduct.unit_name,
                        package_name: (objPackage != null ? "(" + objPackage.product_name + ")" : "")
                    };
                    if (data.quantity > 0) {
                        //var table = $('#tbProduct').DataTable();
                        $('#tbProduct').dataTable().fnAddData(data);
                        $('#tbProduct').dataTable().fnDraw();

                        $("#productCount").html(table.rows().count());
                        $("#pickid_" + product_id).attr("style", "display:none;")

                        if (objProduct.item_id > 0) {

                            data = {
                                id: 0,
                                product_id: objPackage.product_id,
                                product_name: objPackage.product_name,
                                req_forward_qty: 0,
                                quantity: parseInt(dialogResult)
                            };
                            var rowIndexes = -1;
                            $('#tbPackage').DataTable().rows(function (idx, data, node) {
                                if (data.product_id === objPackage.product_id) {

                                    rowIndexes = idx;
                                    data.quantity += parseInt(dialogResult)
                                    $('#tbPackage').DataTable().row(rowIndexes).data(data).draw();
                                }
                            });
                            if (rowIndexes < 0) {

                                $('#tbPackage').dataTable().fnAddData(data);
                                $('#tbPackage').dataTable().fnDraw();

                                $("#pickPackageId_" + objPackage.product_id).attr("style", "display:none;")

                                $("#packageCount").html(tablePKG.rows().count());
                            }

                        }
                        //table.on('order.dt search.dt', function () {
                        //    table.column(0, {search: 'applied', order: 'applied'}).nodes().each(function (cell, i) {
                        //        cell.innerHTML = i + 1;
                        //    });
                        //}).draw();
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

                    var table = $('#tbProduct').DataTable();
                    var data = table.row(tbRowId).data();
                    //var idx = table.row(tbRowId).index();
                    data.quantity = parseInt(dialogResult);
                    $('#tbProduct').DataTable().row(tbRowId).data(data).draw();
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
                //loadDataReqProduct();
            }
        });
    };

    var openDlgNumpad = function () {

        return $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: "app/components/dialog/dialognumpad.html",
            controller: "DialogNumpadController",
            size: "lg",
            scope: scope,
            backdrop: "static",
            resolve: {
                model: function () {
                    return 0;
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
        //$('#tbProduct').DataTable().clear();
        //$('#tbProduct').DataTable().rows().draw();
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
        //var table = $('#tbProduct').DataTable();
        var data = table.rows().data().toArray();
        var dataPKG = tablePKG.rows().data().toArray();
        var postData = {
            _master: newData,
            _lstProducts: data,
            _lstPackages: dataPKG
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
        $("#productCount").html(0);
        $("#packageCount").html(0);
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
                    loadDataReqProduct();
                } else {
                    newData
                }

            }, function (err) {
                console.log(err);
            });


    }
    var loadDataReqProduct = function () {

        $('#tbProduct').DataTable().clear().draw();
        $('#tbPackage').DataTable().clear().draw();
        if ($scope.reqData.requisition_id > 0) {
            var dt = new Date();

            var objFilter = {
                requisition_id: $scope.reqData.requisition_id,
                route_id: $scope.reqData.route_id,
                round: $scope.reqData.round,
                document_date: $scope.document_date,
                requisition_type: "FRW"
            }


            requisitionService.searchReqProduct(objFilter).then(function (responseDet) {

                debugger;
                if (responseDet.result.length > 0) {
                    var dataProduct = responseDet.result;
                    //console.log(dataProduct);
                    //$('#tbProduct').DataTable().clear().draw();
                    //var table = $('#tbProduct').DataTable();

                    var lstReqPackage = [];
                    dataProduct.forEach(function (objData) {
                        $("#pickid_" + objData.product_id).attr("style", "display:none;");

                        var objProduct = _.head(_.filter(lstProduct, {'product_id': objData.product_id}));
                        if (objProduct.item_id > 0) {
                            var objPackage = _.head(_.filter(lstProduct, {'product_id': objProduct.item_id})); // get first element

                            var objReqPKG = _.head(_.filter(lstReqPackage, {'product_id': objPackage.product_id}));
                            debugger;
                            if (objReqPKG == undefined) {
                                var data = {
                                    id: 0,
                                    product_id: objPackage.product_id,
                                    product_name: objPackage.product_name,
                                    req_forward_qty: 0,
                                    quantity: objData.req_forward_qty
                                };
                                $("#pickPackageId_" + objPackage.product_id).attr("style", "display:none;")
                                lstReqPackage.push(data);
                            } else {
                                objReqPKG.quantity += objData.req_forward_qty;
                            }

                        }

                    });

                    $('#tbProduct').dataTable().fnAddData(dataProduct);
                    $('#tbProduct').dataTable().fnDraw();

                    $("#productCount").html(table.rows().count());

                    if (lstReqPackage.length > 0) {

                        $('#tbPackage').dataTable().fnAddData(lstReqPackage);
                        $('#tbPackage').dataTable().fnDraw();

                        $("#packageCount").html(tablePKG.rows().count());
                    }
                    //table.on('order.dt search.dt', function () {
                    //    table.column(0, {search: 'applied', order: 'applied'}).nodes().each(function (cell, i) {
                    //        cell.innerHTML = i + 1;
                    //    });
                    //}).draw();

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

                lstProduct = result;
                var lstImgProduct = _.filter(lstProduct, {'product_type': 1});
                var lstImgPackage = _.filter(lstProduct, {'product_type': 2});
                lstPackage = _.filter(lstProduct, {'product_type': 2});
                lstImgProduct.forEach(function (data, index) {
                    if (data.product_type == 1 && data.type_id != 0) {

                        var li = $('<li id="pickid_' + data.product_id + '"></li>');
                        var tagA = $('<a ng-click="pickProduct(' + data.product_id + ',\'' + data.product_name + '\');" data-rel="colorbox" class="cboxElement"></a>');
                        var pickImg = $('<img width="130" height="130" alt="150x150" src="' + data.img_path + '">');
                        var pickTxt = $('<div class="text"><div class="inner">' + data.product_name + '</div></div>');

                        tagA.append([pickImg, pickTxt]);
                        li.append(tagA);
                        $("#boxPickProduct").append(li);
                    }
                });
                lstImgPackage.forEach(function (data, index) {
                    if (data.product_type == 2 && data.type_id != 0) {

                        var Packli = $('<li id="pickPackageId_' + data.product_id + '"></li>');
                        var PacktagA = $('<a ng-click="pickPackage(' + data.product_id + ',\'' + data.product_name + '\');" data-rel="colorbox" class="cboxElement"></a>');
                        var PackpickImg = $('<img width="130" height="130" alt="150x150" src="' + data.img_path + '">');
                        var PackpickTxt = $('<div class="text"><div class="inner">' + data.product_name + '</div></div>');

                        PacktagA.append([PackpickImg, PackpickTxt]);
                        Packli.append(PacktagA);
                        $("#boxPickPackage").append(Packli);
                    }
                });
                $compile($("#boxPickProduct"))($scope);
                var temp = $compile($("#boxPickPackage"))($scope);
            }
        }, function (err) {
            console.log(err);
        })

    }
});


