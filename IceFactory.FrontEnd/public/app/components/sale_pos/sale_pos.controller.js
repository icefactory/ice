"use strict";

//--------------------------------------------------------------------------------//
//
// Product Controller
//
//--------------------------------------------------------------------------------//
angular.module('IceFactory').controller("SalePOSController", function ($compile, $rootScope, $filter, $uibModal, $scope, $state, $timeout, notificationService, dialogService, productService, requisitionService, routeService) {
    //------------------------------------------------------------------------------------------------
    //
    //
    // Variable for this controller
    //
    //
    //------------------------------------------------------------------------------------------------
    var lstPriceAgency = [];
    var lstProduct = [];
    var lstPackage = [];

    var dt = new Date();
    $scope.reqData = {
        requisition_id: 0,
        route_id: 2,
        route_name: "",
        round: 1,
        transporter1_name: "",
        transporter2_name: "",
        document_date: String(dt.getDate()).padStart(2, '0') + "/" + String((dt.getMonth() + 1)).padStart(2, '0') + "/" + dt.getFullYear(),
    };

    $scope.slipInfo = {
        item_count: 0,
        discount_amt: 0,
        price_amt: 0,
        total_net: 0,
    };
    $scope.customerInfo = {
        customer_id: 1,
        customer_fullname: "ปกติ ทั่วไป",
        customer_name: "ปกติ",
        customer_surname: "ทั่วไป",
    };
    var itemPick = {
        product_id: 0,
        description: "",
        quantity: 0,
        price: 0,
        price_net: 0,
    };
    $scope.newData = {
        requisition_id: 0,
        document_no: "",
        route_id: 0,
        customer_flag: null,
        customer_id: null,
        sell_type: 1,
        requisition_status: 1,
        document_date: moment(dt).format("YYYY-MM-DD"),
        transporter1_id: null,
        transporter2_id: null,
        round: 0,
        description: "",
        price_net: 0,
        status: "Y",
        requisition_type: "POS",
        ModifyByUserId: 1,
        route_name: "",
        transporter1_name: "",
        transporter2_name: "",

    };
    $scope.document_date = $scope.reqData.document_date;
    var isDisplay = false;

    $rootScope.currentPage = {
        title: "ขายหน้าโรง (เงินสด)",
    };
    $scope.rowSelect = null;
    $scope.dataSelect = {};
    var colDefine = [
        {
            /*"title": "รหัสสินค้า",*/
            "className": "text-center",
            "data": "product_id",
            "width": "30px",
            bSort: false,
            bVisible: false
        },
        //{/*"title": "ซื้อสินค้า", */"className": "text-left", "data": "description"},
        {
            /*"title": "ซื้อสินค้า",*/ "className": "text-left",// "data": "product_name",
            mRender: function (data, type, row, meta) {
                return '<div style="">' + row.product_name + '<span class=" pull-right">' + row.price + ' บาท</span></div><span class=" pull-right">' + ((row.package_name == null) ? "" : row.package_name) + '</span>';
            }
        },
        {
            //"title": "จ่ายจำนวน",
            //"width": "150px",
            "className": "text-center",
            //bSortable: false,
            mRender: function (data, type, row, meta) {
                var edit = '<div class="btn-group-xs btn-corner pull-left"><button id="btnSubtract" class="btn btn-danger"><i class="icon-only  ace-icon ace-icon fa fa-minus bigger-110"></i></button><button id="btnEdit" type="button" class="btn btn-white btn-pink btn-xs" style="width: 40px;">' + row.quantity + '</button><button id="btnPlus" class="btn btn-success"><i class="icon-only  ace-icon ace-icon fa fa-plus bigger-110"></i></button></div>';
                var display = '<div class=" pull-left">' + row.quantity + '</div>';
                return ((isDisplay) ? display : edit) + '<span class="pull-right">' + row.unit_name + '</span>'
            }
        },
        {
            /*"title": "ซื้อสินค้า", */
            "width": "80px",
            "className": "text-right",
            "data": "price_net",
            render: $.fn.dataTable.render.number(',', '.', 0, '')
        },
    ]


    var table = $('#tbPickData').DataTable({
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
        "bInfo": false,
        "bLengthMenu": false, // Hide page lengthMenu
    });

    $('#tbPickData tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });

    $('#tbPickData tbody').on('click', '#btnEdit', function () {
        var table = $('#tbPickData').DataTable();
        var data = table.row($(this).parents('tr')).data();
        var idx = table.row($(this).parents('tr')).index();
        //console.log(data);
        scope.param = data;
        $scope.showDlgChangeItem(idx);
    });


    $('#tbPickData tbody').on('click', '#btnPlus', function () {
        var table = $('#tbPickData').DataTable();
        var data = table.row($(this).parents('tr')).data();
        var idx = table.row($(this).parents('tr')).index();
        //console.log(data);
        //if (data.quantity > 0) {
        data.quantity += 1;
        /*if (data.id < 0) {
         data.req_forward_qty = data.quantity;
         }*/
        data.price_net = data.price * data.quantity;
        $('#tbPickData').DataTable().row(idx).data(data).draw();
        //}

        calcTotalnet();

    });


    $('#tbPickData tbody').on('click', '#btnSubtract', function () {
        var table = $('#tbPickData').DataTable();
        var data = table.row($(this).parents('tr')).data();
        var idx = table.row($(this).parents('tr')).index();
        if (data.quantity > 0) {
            data.quantity -= 1;
            /*if (data.id < 0) {
             data.req_forward_qty = data.quantity;
             }*/
            data.price_net = data.price * data.quantity;
            $('#tbPickData').DataTable().row(idx).data(data).draw();

            calcTotalnet();
        }
    });


    var colDefinePKG = [
        {/*"title": "id",*/ "className": "text-center", "data": "id", "width": "80px", bVisible: false},
        {/*"title": "รหัส",*/ "className": "text-center", "data": "product_id", "width": "80px", bVisible: false},
        //{/*"title": "ชื่อบรรจุภัณฑ์", */"className": "text-left", "data": "product_name"},
        //{"title": "ขอเบิก", "width": "80px", "className": "text-center", "data": "req_forward_qty"},
        {
            /*"title": "ซื้อสินค้า",*/ "className": "text-left",// "data": "product_name",
            mRender: function (data, type, row, meta) {
                return '<div style="">' + row.product_name + '<span class=" pull-right">' + row.price + ' บาท</span></div>';
            }
        },
        {
            //"title": "จ่ายจำนวน",
            //"width": "150px",
            "className": "text-center",
            //bSortable: false,
            mRender: function (data, type, row, meta) {
                var edit = '<div class="btn-group-xs btn-corner pull-left"><button id="btnSubtract" class="btn btn-danger"><i class="icon-only  ace-icon ace-icon fa fa-minus bigger-110"></i></button><button id="btnEdit" type="button" class="btn btn-white btn-pink btn-xs" style="width: 40px;">' + row.quantity + '</button><button id="btnPlus" class="btn btn-success"><i class="icon-only  ace-icon ace-icon fa fa-plus bigger-110"></i></button></div>';
                var display = '<div class=" pull-left">' + row.quantity + '</div>';
                return ((isDisplay) ? display : edit) + '<span class="pull-right">' + row.unit_name + '</span>'
            }
        },
        {
            /*"title": "ซื้อสินค้า", */
            "width": "80px",
            "className": "text-right",
            "data": "price_net",
            render: $.fn.dataTable.render.number(',', '.', 0, '')
        },
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

                data.price_net = data.price * data.quantity;
                if (data.quantity > 0) {
                    //var table = $('#tbProduct').DataTable();
                    tablePKG.dataTable().fnAddData(data);
                    tablePKG.dataTable().fnDraw();

                    $("#pickPackageId_" + product_id).attr("style", "display:none;")

                    //table.on('order.dt search.dt', function () {
                    //    table.column(0, {search: 'applied', order: 'applied'}).nodes().each(function (cell, i) {
                    //        cell.innerHTML = i + 1;
                    //    });
                    //}).draw();

                    calcTotalnet();
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

        data.price_net = data.price * data.quantity;
        $('#tbPackage').DataTable().row(idx).data(data).draw();
        //}

        calcTotalnet();
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

            data.price_net = data.price * data.quantity;
            $('#tbPackage').DataTable().row(idx).data(data).draw();

            calcTotalnet();
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



            /*let modalDialog = $uibModal.open({
             animation: $scope.animationsEnabled,
             templateUrl: "app/components/dialog/dialognumpad.html",
             controller: "DialogNumpadController",
             size: "lg",
             scope: scope,
             backdrop: "static",
             resolve: {
             model: function () {
             return {product_id: product_id, product_name: product_name, price_in: price_in};
             }
             }
             });*/
            //let modalDialog = openDlgNumpad();
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
                        package_name: (objPackage != null ? "(" + objPackage.product_name + ")" : ""),
                        price: 0,
                        price_net: 0,
                    };
                    data.product_id = objProduct.product_id;
                    data.description = objProduct.product_name + ' = ' + objProduct.price_out + ' บาท';
                    data.price = objProduct.price_out;
                    // calc price net
                    data.price_net = data.price * data.quantity;

                    data.quantity = parseInt(dialogResult);
                    // calc price net
                    data.price_net = data.price * data.quantity;

                    if (data.quantity > 0) {
                        var table = $('#tbPickData').DataTable();
                        $('#tbPickData').dataTable().fnAddData(data);
                        $('#tbPickData').dataTable().fnDraw();

                        $("#pickid_" + product_id).attr("style", "display:none;")

                        if (objProduct.item_id > 0) {

                            data = {
                                id: 0,
                                product_id: objPackage.product_id,
                                product_name: objPackage.product_name,
                                req_forward_qty: 0,
                                quantity: parseInt(dialogResult),
                                unit_name: objPackage.unit_name,
                                price: objPackage.price_out,
                                price_net: 0,
                            };
                            data.price_net = data.price * data.quantity;

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

                        calcTotalnet();

                    }
                }
            });
        }
    }
    let scopeChg = $scope.$new();
    $scope.showDlgChangeItem = function (tbRowId) {
        let modalDialog = openDlgNumpad();

        modalDialog.result.then(function (dialogResult) {
            if (dialogResult != null) {
                // Refresh ข้อมูลใน Grid ใหม่
                if (parseInt(dialogResult) > 0) {


                    var table = $('#tbPickData').DataTable();
                    var data = table.row(tbRowId).data();
                    //var idx = table.row(tbRowId).index();
                    data.quantity = parseInt(dialogResult);
                    data.price_net = data.price * data.quantity;
                    $('#tbPickData').DataTable().row(tbRowId).data(data).draw();
                    calcTotalnet();
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

                loadDataReqRoute();

                //$scope.reqData.route_id = dialogResult.route_id;
                //$scope.reqData.route_name = dialogResult.route_name;
                //$scope.reqData.transporter1_name = dialogResult.transporter1_name;
                //$scope.reqData.transporter2_name = dialogResult.transporter2_name;

                $scope.newData.route_id = dialogResult.route_id;
                $scope.newData.route_name = dialogResult.route_name;
                $scope.newData.transporter1_id = dialogResult.transporter1_id;
                $scope.newData.transporter2_id = dialogResult.transporter2_id;
                $scope.newData.transporter1_name = dialogResult.transporter1_name;
                $scope.newData.transporter2_name = dialogResult.transporter2_name;
            }
        });
    };

    $scope.showDlgCustomer = function () {
        let modalDialog = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: "app/components/dialog/customer-dialog.html",
            controller: "DialogCustomerController",
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
                $scope.customerInfo.customer_id = dialogResult.customer_id;
                $scope.customerInfo.customer_fullname = dialogResult.customer_name + ' ' + dialogResult.customer_surname;

                getPriceAgency(dialogResult.customer_id, function () {
                    var data = table.rows().data().toArray();
                    var dataPKG = tablePKG.rows().data().toArray();
                    data.forEach(function (obj) {
                        var objProduct = _.head(_.filter(lstProduct, {product_id: obj.product_id}));
                        obj.price = objProduct.price_out;
                        obj.price_net = obj.price * obj.quantity;
                    });
                    debugger;
                    $('#tbPickData').DataTable().clear();
                    $('#tbPickData').dataTable().fnAddData(data);
                    $('#tbPickData').dataTable().fnDraw();
                    dataPKG.forEach(function (obj) {
                        var objProduct = _.head(_.filter(lstProduct, {product_id: obj.product_id}));

                        obj.price = objProduct.price_out;
                        obj.price_net = obj.price * obj.quantity;
                    });
                    $('#tbPackage').DataTable().clear();
                    $('#tbPackage').dataTable().fnAddData(dataPKG);
                    $('#tbPackage').dataTable().fnDraw();
                    calcTotalnet();
                });

            }
        });
    };

    var openDlgNumpad = function () {
        return $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: "app/components/dialog/dialognumpad.html",
            controller: "DialogNumpadController",
            size: "lg",
            scope: scopeChg,
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
        if ($scope.slipInfo.price_amt > 0) {
            location.reload();
        }
        //$('#tbPickData').DataTable().clear();
        //$('#tbPickData').DataTable().rows().draw();
        //loadDataReqRoute();
        //loadDataReqProduct();
        //$("[id^=pickid_]").forEach(function (li) {
        //    $(li).removeAttr("style");
        //    /* Stype Display*/
        //});
    }


    $scope.saveData = function () {
        //var table = $('#tbPickData').DataTable();
        var data = table.rows().data().toArray();
        var dataPKG = tablePKG.rows().data().toArray();
        $scope.newData.customer_id = $scope.customerInfo.customer_id;
        var postData = {
            _master: $scope.newData,
            _lstProducts: data,
            _lstPackages: dataPKG,

        }

        console.log(postData);
        requisitionService.saveData(postData)
            .then(function (response) {
                console.log(response);
                if (response.result != null) {
                    alert("Success");
                    //initData();
                    window.location.reload();
                }
            }, function (err) {
                var sMsg = "";
                if (err.length > 0) {
                    err.forEach(function () {
                        sMsg += err.message;
                    });
                }
                alert(err);
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

                if (response.result.length > 0) {
                    var dataReq = JSON.parse(JSON.stringify(response.result[0]));
                    dataReq.requisition_type = "POS"; // บันทึกจ่ายสินค้า
                    $scope.reqData = dataReq;
                    $scope.newData = dataReq;
                    if (dataReq.requisition_status == 2) {
                        isDisplay = true;
                        $("#btnGrp").attr("style", "display:none;");
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

        $('#tbPickData').DataTable().clear().draw();

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

                if (responseDet.result.length > 0) {
                    var dataProduct = responseDet.result;
                    //console.log(dataProduct);
                    var table = $('#tbPickData').DataTable();
                    //$('#tbPickData').DataTable().clear().draw();
                    $('#tbPickData').dataTable().fnAddData(dataProduct);
                    $('#tbPickData').dataTable().fnDraw();

                    dataProduct.forEach(function (objData) {
                        $("#pickid_" + objData.product_id).attr("style", "display:none;");
                    });

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

                getPriceAgency($scope.customerInfo.customer_id, null);
            }
        }, function (err) {
            console.log(err);
        })

    }

    var calcTotalnet = function () {
        //var table = $('#tbPickData').DataTable();
        var lstData = table.rows().data().toArray();
        var lstPKG = tablePKG.rows().data().toArray();
        var sumPrice = 0;
        lstData.forEach(function (item) {
            sumPrice += item.price_net;
        });
        lstPKG.forEach(function (item) {
            sumPrice += item.price_net;
        });
        $scope.slipInfo.item_count = lstData.length;
        $scope.slipInfo.price_amt = sumPrice;
        $scope.slipInfo.total_net = sumPrice;

        $("#infoItemCount").html(numeral($scope.slipInfo.item_count).format('0,0'));
        $("#infoPriceAmt").html(numeral($scope.slipInfo.price_amt).format('0,0'));
        $("#infoDiscount").html(numeral($scope.slipInfo.discount_amt).format('0,0'));
        $("#infoTotalNet").html(numeral($scope.slipInfo.total_net - $scope.slipInfo.discount_amt).format('0,0'));
    };

    $scope.editDiscount = function () {

        let modalDialog = openDlgNumpad();

        modalDialog.result.then(function (dialogResult) {
            if (dialogResult != null) {
                if (parseInt(dialogResult) < $scope.slipInfo.price_amt) {
                    $scope.slipInfo.discount_amt = parseInt(dialogResult);
                    calcTotalnet();
                }
            }
        });

    };
    var getPriceAgency = function (cus_id, callBack) {
        productService.getPrice(cus_id)
            .then(function (response) {
                if (response.length > 0) {
                    lstPriceAgency = response;

                    lstProduct.forEach(function (obj) {
                        var objPriceAgency = _.head(_.filter(lstPriceAgency, {product_id: obj.product_id}));
                        obj.price_out = objPriceAgency.price;
                    });
                    if (callBack != null) {
                        callBack();
                    }
                }
            }, function (err) {
                var sMsg = "";
                if (err.length > 0) {
                    err.forEach(function () {
                        sMsg += err.message;
                    });
                }
                alert(err);
            })
    }
})
;


