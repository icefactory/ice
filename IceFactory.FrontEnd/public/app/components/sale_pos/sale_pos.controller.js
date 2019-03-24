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
        {/*"title": "รหัสสินค้า",*/ "className": "text-center", "data": "product_id", "width": "50px", bSort: false},
        {/*"title": "ซื้อสินค้า", */"className": "text-left", "data": "description"},
        {
            //"title": "จ่ายจำนวน",
            //"width": "150px",
            "className": "text-center",
            //bSortable: false,
            mRender: function (data, type, row, meta) {
                var edit = '<div class="btn-group-xs btn-corner"><button id="btnSubtract" class="btn btn-danger"><i class="icon-only  ace-icon ace-icon fa fa-minus bigger-110"></i></button><button id="btnEdit" type="button" class="btn btn-white btn-pink btn-xs" style="width: 40px;">' + row.quantity + '</button><button id="btnPlus" class="btn btn-success"><i class="icon-only  ace-icon ace-icon fa fa-plus bigger-110"></i></button></div>';
                var display = '<div>' + row.quantity + '</div>';
                return (isDisplay) ? display : edit
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
        "order": [[0, 'asc']]
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
    $scope.showDlgNumpad = function (product_id, product_name, price_in) {
        if (isDisplay == false) {
            var data = {
                product_id: 0,
                description: "",
                quantity: 0,
                price: 0,
                price_net: 0,
            };
            data.product_id = product_id;
            data.description = product_name + ' = ' + price_in + ' บาท';
            data.price = price_in;
            // calc price net
            data.price_net = data.price * data.quantity;

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
            let modalDialog = openDlgNumpad();
            modalDialog.result.then(function (dialogResult) {
                if (dialogResult != null) {
                    //var data = {
                    //    id: 0,
                    //    product_id: product_id,
                    //    product_name: product_name,
                    //    req_forward_qty: 0,
                    //    quantity: parseInt(dialogResult)
                    //};
                    data.quantity = parseInt(dialogResult);
                    // calc price net
                    data.price_net = data.price * data.quantity;

                    if (data.quantity > 0) {
                        var table = $('#tbPickData').DataTable();
                        $('#tbPickData').dataTable().fnAddData(data);
                        $('#tbPickData').dataTable().fnDraw();

                        $("#pickid_" + product_id).attr("style", "display:none;")

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
                debugger;
                $scope.customerInfo.customer_id = dialogResult.customer_id;
                $scope.customerInfo.customer_fullname = dialogResult.customer_name + ' ' + dialogResult.customer_surname;
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
                    //return tbRowId;
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
        var table = $('#tbPickData').DataTable();
        var data = table.rows().data().toArray();
        $scope.newData.customer_id = $scope.customerInfo.customer_id;
        var postData = {
            _master: $scope.newData,
            _lstProducts: data,
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
                debugger;
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
        debugger;
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
                    dataReq.requisition_type = "APR"; // บันทึกจ่ายสินค้า
                    $scope.reqData = dataReq;
                    newData = dataReq;
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

                //debugger;
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
            debugger;
            if (result) {
                //console.log(result);
                result.forEach(function (data, index) {
                    if (data.product_type == 1) {

                        var li = $('<li id="pickid_' + data.product_id + '"></li>');
                        var tagA = $('<a ng-click="showDlgNumpad(' + data.product_id + ',\'' + data.product_name + '\',' + data.price_in + ');" data-rel="colorbox" class="cboxElement"></a>');
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

    var calcTotalnet = function () {
        var table = $('#tbPickData').DataTable();
        var lstData = table.rows().data().toArray();
        var sumPrice = 0;
        lstData.forEach(function (item) {
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
})
;


