"use strict";

//--------------------------------------------------------------------------------//
//
// Product Controller
//
//--------------------------------------------------------------------------------//
angular.module('IceFactory').controller("ReturnRequisitionController", function ($compile, $rootScope, $filter, $uibModal, $scope, $state, $timeout, notificationService, dialogService, productService, return_requisitionService) {
    //------------------------------------------------------------------------------------------------
    //
    //
    // Variable for this controller
    //
    //
    //------------------------------------------------------------------------------------------------
    var lstPriceAgency = [];
    $scope.lstItemPrepare = [];
    $scope.selectProd = {};
    var dt = new Date();
    $scope.reqData = {
        requisition_id: 0,
        route_id: 2,
        route_name: "",
        round: 1,
        transporter1_name: "",
        transporter2_name: "",
        //document_date: String(dt.getDate()).padStart(2, '0') + "/" + String((dt.getMonth() + 1)).padStart(2, '0') + "/" + dt.getFullYear(),
        //document_date: "09/" + String((dt.getMonth() + 1)).padStart(2, '0') + "/" + dt.getFullYear(),
        document_date: dt.getFullYear() + "-" + String((dt.getMonth() + 1)).padStart(2, '0') + "-" + "09"
    };

    $scope.itemInfo = {
        customer_id: 1,
        customer_fullname: "ปกติ ทั่วไป",
        customer_name: "ปกติ",
        customer_surname: "ทั่วไป",
        product_id: 0,

        product_name: "",
        //customer_id: $scope.customerInfo.customer_id,
        //customer_name: $scope.customerInfo.customer_fullname,
        quantity: 0,
        price: 0,
        sum_price: 0,
        arrears_price: 0,
        product_ref: "",
        retrun_requisition_id: 0,
        order_no: 0
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
    var isValidReturn = false;
    $rootScope.currentPage = {
        title: "คืนสินค้า",
    };
    $scope.rowSelect = null;
    $scope.dataSelect = {};
    var colDefine = [
        //{"title": "#", "className": "text-center", "data": null, "width": "30px", bSort: false},
        {"title": "รหัสสินค้า", "className": "text-center", "data": "product_id", "width": "30px", bVisible: false},
        {"title": "ซื้อสินค้า", "className": "text-left", "data": "product_name", "width": "130px"},
        {"title": "เบิกทั้งหมด", "width": "80px", "className": "text-center", "data": "quantity"},
        {
            "title": "เสียหาย<br/>ชำรุด/ละลาย",
            "width": "150px",
            "className": "text-center",
            //bSortable: false,
            mRender: function (data, type, row, meta) {
                var edit = '<div class="btn-group-xs btn-corner"><button id="btnSubtractMelt" class="btn btn-danger"><i class="icon-only  ace-icon ace-icon fa fa-minus bigger-110"></i></button><button id="btnEditMelt" type="button" class="btn btn-white btn-pink btn-xs" style="width: 40px;">' + row.ice_melt + '</button><button id="btnPlusMelt" class="btn btn-success"><i class="icon-only  ace-icon ace-icon fa fa-plus bigger-110"></i></button></div>';
                var display = '<div>' + row.ice_melt + '</div>';
                return (isDisplay) ? display : edit
            }
        },
        {
            "title": "คืนจำนวน",
            "width": "150px",
            "className": "text-center",
            //bSortable: false,
            mRender: function (data, type, row, meta) {
                var edit = '<div class="btn-group-xs btn-corner"><button id="btnSubtractReturn" class="btn btn-danger"><i class="icon-only  ace-icon ace-icon fa fa-minus bigger-110"></i></button><button id="btnEditReturn" type="button" class="btn btn-white btn-pink btn-xs" style="width: 40px;">' + row.return_quantity + '</button><button id="btnPlusReturn" class="btn btn-success"><i class="icon-only  ace-icon ace-icon fa fa-plus bigger-110"></i></button></div>';
                var display = '<div>' + row.return_quantity + '</div>';
                return (isDisplay) ? display : edit
            }
        },
        {"title": "ขายทั้งหมด", "width": "80px", "className": "text-center", "data": "total_amt"},
    ]


    var table = $('#tbProd').DataTable({
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

    $('#tbData tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });

    $('#tbProd tbody').on('click', '#btnEditReturn', function () {
        //var table = $('#tbProd').DataTable();
        var data = table.row($(this).parents('tr')).data();
        var idx = table.row($(this).parents('tr')).index();
        //console.log(data);
        scope.param = data;
        openDlgNumpad().result.then(function (dialogResult) {
            if (dialogResult != null && dialogResult != data.return_quantity) {
                isValidReturn = false;
                data.return_quantity = ((data.quantity - (dialogResult + data.ice_melt) < 0) ? data.quantity - data.ice_melt : dialogResult);
                data.total_amt = data.quantity - (data.return_quantity + data.ice_melt);
                $('#tbProd').DataTable().row(idx).data(data).draw();
            }
        });
    });


    $('#tbProd tbody').on('click', '#btnPlusReturn', function () {
        //var table = $('#tbProd').DataTable();
        var data = table.row($(this).parents('tr')).data();
        var idx = table.row($(this).parents('tr')).index();
        //console.log(data);
        if (data.quantity - (data.return_quantity + data.ice_melt) != 0) {
            isValidReturn = false;
            data.return_quantity += 1;
            data.total_amt = data.quantity - (data.return_quantity + data.ice_melt);
            $('#tbProd').DataTable().row(idx).data(data).draw();
        }
    });


    $('#tbProd tbody').on('click', '#btnSubtractReturn', function () {
        var table = $('#tbProd').DataTable();
        var data = table.row($(this).parents('tr')).data();
        var idx = table.row($(this).parents('tr')).index();
        if (data.return_quantity > 0) {
            isValidReturn = false;
            data.return_quantity -= 1;
            data.total_amt = data.quantity - (data.return_quantity + data.ice_melt);
            $('#tbProd').DataTable().row(idx).data(data).draw();
        }
    });


    $('#tbProd tbody').on('click', '#btnEditMelt', function () {
        //var table = $('#tbProd').DataTable();
        var data = table.row($(this).parents('tr')).data();
        var idx = table.row($(this).parents('tr')).index();
        //console.log(data);
        openDlgNumpad().result.then(function (dialogResult) {
            if (dialogResult != null && dialogResult != data.ice_melt) {
                isValidReturn = false;
                data.ice_melt = ((data.quantity - (data.return_quantity + dialogResult) < 0) ? data.quantity - data.return_quantity : dialogResult);
                data.total_amt = data.quantity - (data.return_quantity + data.ice_melt);
                $('#tbProd').DataTable().row(idx).data(data).draw();
            }
        });
    });


    $('#tbProd tbody').on('click', '#btnPlusMelt', function () {
        //var table = $('#tbProd').DataTable();
        var data = table.row($(this).parents('tr')).data();
        var idx = table.row($(this).parents('tr')).index();
        //console.log(data);
        if (data.quantity - (data.return_quantity + data.ice_melt) != 0) {
            isValidReturn = false;
            data.ice_melt += 1;
            data.total_amt = data.quantity - (data.return_quantity + data.ice_melt);
            $('#tbProd').DataTable().row(idx).data(data).draw();
        }
    });


    $('#tbProd tbody').on('click', '#btnSubtractMelt', function () {
        var table = $('#tbProd').DataTable();
        var data = table.row($(this).parents('tr')).data();
        var idx = table.row($(this).parents('tr')).index();
        if (data.ice_melt > 0) {
            isValidReturn = false;
            data.ice_melt -= 1;
            data.total_amt = data.quantity - (data.return_quantity + data.ice_melt);
            $('#tbProd').DataTable().row(idx).data(data).draw();
        }
    });
    var colDefinePKG = [
        //{"title": "#", "className": "text-center", "data": null, "width": "30px", bSort: false},
        {"title": "รหัส", "className": "text-center", "data": "product_id", "width": "80px", bVisible: false},
        {"title": "ชื่อบรรจุภัณฑ์", "className": "text-left", "data": "package_name"},
        {"title": "เบิกทั้งหมด", "width": "80px", "className": "text-center", "data": "quantity"},
        {
            "title": "เสียหาย<br/>ชำรุด",
            "width": "150px",
            "className": "text-center",
            //bSortable: false,
            mRender: function (data, type, row, meta) {
                var edit = '<div class="btn-group-xs btn-corner"><button id="btnSubtract" class="btn btn-danger"><i class="icon-only  ace-icon ace-icon fa fa-minus bigger-110"></i></button><button id="btnEdit" type="button" class="btn btn-white btn-pink btn-xs" style="width: 40px;">' + row.damage + '</button><button id="btnPlus" class="btn btn-success"><i class="icon-only  ace-icon ace-icon fa fa-plus bigger-110"></i></button></div>';
                var display = '<div>' + row.damage + '</div>';
                return (isDisplay) ? display : edit
            }
        },
        /*{
         "title": "คืนจำนวน",
         "width": "150px",
         "className": "text-center",
         //bSortable: false,
         mRender: function (data, type, row, meta) {
         var edit = '<div class="btn-group-xs btn-corner"><button id="btnSubtract" class="btn btn-danger"><i class="icon-only  ace-icon ace-icon fa fa-minus bigger-110"></i></button><button id="btnEdit" type="button" class="btn btn-white btn-pink btn-xs" style="width: 40px;">' + row.return_quantity + '</button><button id="btnPlus" class="btn btn-success"><i class="icon-only  ace-icon ace-icon fa fa-plus bigger-110"></i></button></div>';
         var display = '<div>' + row.return_quantity + '</div>';
         return (isDisplay) ? display : edit
         }
         },*/
        {"title": "คืนจำนวน", "width": "80px", "className": "text-center", "data": "return_quantity"},
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
        openDlgNumpad().result.then(function (dialogResult) {
            if (dialogResult != null) {
                data.damage = ((data.quantity < dialogResult) ? data.quantity : dialogResult);
                data.return_quantity = data.quantity - data.damage;
                $('#tbPackage').DataTable().row(idx).data(data).draw();
            }
        });
    });


    $('#tbPackage tbody').on('click', '#btnPlus', function () {
        //var tablePKG = $('#tbPackage').DataTable();
        var data = tablePKG.row($(this).parents('tr')).data();
        var idx = tablePKG.row($(this).parents('tr')).index();
        //console.log(data);
        if (data.quantity - data.damage != 0) {
            data.damage += 1;
            data.return_quantity = data.quantity - data.damage;
            $('#tbPackage').DataTable().row(idx).data(data).draw();
        }
    });


    $('#tbPackage tbody').on('click', '#btnSubtract', function () {
        //var table = $('#tbPackage').DataTable();
        var data = tablePKG.row($(this).parents('tr')).data();
        var idx = tablePKG.row($(this).parents('tr')).index();
        if (data.damage > 0) {
            data.damage -= 1;
            data.return_quantity = data.quantity - data.damage;
            $('#tbPackage').DataTable().row(idx).data(data).draw();
        }
    });


    var colDefineItem = [
        //{"title": "id", "className": "text-center", "data": "id", "width": "80px", bVisible: false},
        {
            "width": "20px",
            "className": "text-center",
            mRender: function () {
                return '<button id="btnDel" class="btn btn-xs btn-danger"><i class="icon-only ace-icon fa fa-trash-o bigger-110"></i></button>';
            }
        },
        // {"title": "รหัส", "className": "text-center", "data": "product_id", "width": "80px", bVisible: false},
        {"title": "ลูกค้า/เอเย่นต์", "className": "text-left", "data": "customer_name"},
        {"title": "ชื่อสินค้า", "className": "text-left", "data": "product_name"},

        {"title": "ราคา", "width": "80px", "className": "text-center", "data": "price"},
        {"title": "ขายจำนวน", "width": "80px", "className": "text-center", "data": "quantity"},
        {"title": "ค้างชำระ", "width": "80px", "className": "text-right", "data": "arrears_price"},
        {
            "title": "ราคารวม",
            "width": "80px",
            "className": "text-right",
            "data": "sum_price",
            render: $.fn.dataTable.render.number(',', '.', 0, '')
        },
        /*{
         "title": "คืนจำนวน",
         "width": "150px",
         "className": "text-center",
         //bSortable: false,
         mRender: function (data, type, row, meta) {
         var edit = '<div class="btn-group-xs btn-corner"><button id="btnSubtract" class="btn btn-danger"><i class="icon-only  ace-icon ace-icon fa fa-minus bigger-110"></i></button><button id="btnEdit" type="button" class="btn btn-white btn-pink btn-xs" style="width: 40px;">' + row.return_quantity + '</button><button id="btnPlus" class="btn btn-success"><i class="icon-only  ace-icon ace-icon fa fa-plus bigger-110"></i></button></div>';
         var display = '<div>' + row.return_quantity + '</div>';
         return (isDisplay) ? display : edit
         }
         },*/
        //{"title": "คืนจำนวน", "width": "80px", "className": "text-center", "data": "return_quantity"},
    ]

    var tableItem = $('#tbItem').DataTable({
        "paging": false,
        "destroy": true,
        "searching": false,
        "ordering": false,
        "processing": false,
        "serverSide": false,
        "columns": colDefineItem,
        "autoWidth": false,
        "data": [],
        "order": [[1, 'asc']],
        "bLength": false,
        "bInfo": false,
    });

    $('#tbItem tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            tableItem.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });

    $('#tbItem tbody').on('click', '#btnEdit', function () {
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


    $('#tbItem tbody').on('click', '#btnDel', function () {
        //var tablePKG = $('#tbPackage').DataTable();
        var data = tableItem.row($(this).parents('tr')).data();
        var idx = tableItem.row($(this).parents('tr')).index();
        $('#tbItem').DataTable().row(idx).remove().draw();

// เพิ่มจำนวนคงเหลือ
        fncManipulateItemRemain(data.product_id, 1, data.quantity);
        initDDL();
    });


    $('#tbItem tbody').on('click', '#btnSubtract', function () {
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

    $('input').keydown(function (e) {
        var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        if (key == 13) {
            var ntabindex = parseInt($(this).attr("tabindex")) + 1;
            $("[tabindex=" + ntabindex + "]").focus();
            return false;
        }

    });

    $('#fuelux-wizard-container')
        .ace_wizard({
            //step: 2 //optional argument. wizard will jump to step "2" at first
            //buttons: '.wizard-actions:eq(0)'
        })
        .on('actionclicked.fu.wizard', function (e, info) {
            // when click next validate
            if (info.step == 1 && info.direction == "next" && tablePKG.rows().count() <= 0) {
                e.preventDefault();
            } else if (info.step == 2 && info.direction == "next") {
                if (!validateBalance()) {
                    e.preventDefault();
                } else {
                    $("#btnNext").addClass("invisible");
                }
            } else if (info.step == 2 && info.direction == "previous") {
                $("#btnPrevt").addClass("invisible");
            } else {
                $("#btnPrevt").removeClass("invisible");
                $("#btnNext").removeClass("invisible");
            }

            if (info.step == 1 && info.direction == "next" && !isValidReturn) {
                isValidReturn = true;
                //to do Generate ItemData
                prepareItemData();
            } else if (info.step == 2 && info.direction == "next") {

            } else if (info.step == 2 && info.direction == "previous") {
                //
            } else {

            }
        })
        //.on('changed.fu.wizard', function() {
        //})
        //.on('finished.fu.wizard', function (e) {
        //    bootbox.dialog({
        //        message: "Thank you! Your information was successfully saved!",
        //        buttons: {
        //            "success": {
        //                "label": "OK",
        //                "className": "btn-sm btn-primary"
        //            }
        //        }
        //    });
        //})
        .on('stepclick.fu.wizard', function (e) {
            //e.preventDefault();//this will prevent clicking and selecting steps
        });
    $('#ddlSelectProd').on('change', function () {
        ddlProdChange(this);
    });
    //------------------------------------------------------------------------------------------------
    //
    //
    // AngularJs Events
    //
    //
    //------------------------------------------------------------------------------------------------
    $scope.$on("$viewContentLoaded", function (event) {

        //initImgProduct();

        //$("#txtArrearAmt").inputNumberFormat({
        //    //'decimal': 2,
        //    //'decimalAuto': 2,
        //    //'separator': '.',
        //    //'separatorAuthorized': [',']
        //});
        $(".number").number(true, 0);


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
    $scope.showDlgNumpad = function () {

        openDlgNumpad().result.then(function (dialogResult) {
            if (dialogResult != null) {

                $scope.itemInfo.quantity = numeral($("#prodRemantAmt").html())._value < dialogResult ? numeral($("#prodRemantAmt").html())._value : dialogResult;
            }
        });
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

                    var table = $('#tbProd').DataTable();
                    var data = table.row(tbRowId).data();
                    //var idx = table.row(tbRowId).index();
                    data.quantity = parseInt(dialogResult);
                    $('#tbProd').DataTable().row(tbRowId).data(data).draw();
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

                isValidReturn = false;
                $scope.reqData.route_id = dialogResult.route_id;
                $scope.reqData.route_name = dialogResult.route_name;
                $scope.reqData.transporter1_name = dialogResult.transporter1_name;
                $scope.reqData.transporter2_name = dialogResult.transporter2_name;

                loadDataReqRoute();
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
                $scope.itemInfo.customer_id = dialogResult.customer_id;
                $scope.itemInfo.customer_name = dialogResult.customer_name + ' ' + dialogResult.customer_surname;
                getPriceAgency(dialogResult.customer_id);
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
        var i = numeral($("#ddlSelectProd").val());
        if ($scope.itemInfo.quantity <= 0) {
            dialogService.messageDialog("เกิดข้อผิดพลาด", "จำนวนต้องมากกว่า 0 ");
            return;
        }
        //if(i._value <= 0 ){
        //    dialogService.messageDialog("เกิดข้อผิดพลาด", "กรุณาเลือกข้อมูลสินค้า ");
        //    return ;
        //}

        var objSelect = _.head(_.filter($scope.lstItemPrepare, {product_id: i._value}));
        addItem(objSelect, $scope.itemInfo.quantity, $scope.itemInfo.arrears_price);

        initDDL();
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
        //$('#tbProd').DataTable().clear();
        //$('#tbProd').DataTable().rows().draw();
        //loadDataReqRoute();
        //loadDataReqProduct();
        $("[id^=pickid_]").forEach(function (li) {
            $(li).removeAttr("style");
            /* Stype Display*/
        });
    }

    $scope.saveData = function () {
        var table = $('#tbProd').DataTable();
        var data = table.rows().data().toArray();
        var dataPKG = tablePKG.rows().data().toArray();
        var dataItem = tableItem.rows().data().toArray();
        var postData = {
            _master: $scope.reqData,
            _lstProducts: data,
            _lstPackages: dataPKG,
            _lstItems: dataItem,

        }
        //console.log(postData);
        return_requisitionService.saveData(postData)
            .then(function (response) {
                console.log(response);
                if (response.result != null) {
                    alert("Success");
                    initData();
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
            //requisition_id: $scope.reqData.requisition_id,
            route_id: $scope.reqData.route_id,
            //round: $scope.reqData.round,
            document_date: $scope.document_date,
            //requisition_type: "FRW"
        }
        $('#tbProd').DataTable().clear();
        $('#tbPackage').DataTable().clear();
        $('#tbItem').DataTable().clear();

        return_requisitionService.initReturnReqByRoute(objFilter)
            .then(function (response) {
                //console.log(response.result);

                if (response.result._vwMaster != null) {
                    var dataReq = response.result._vwMaster;// JSON.parse(JSON.stringify(response.result[0]));
                    var dataReturnProduct = response.result._lstVwProducts;
                    var dataReturnPackage = response.result._lstVwPackages;
                    $scope.lstItemPrepare = response.result._lstVwPrepareItems;
                    $scope.reqData = dataReq;
                    //console.log(dataReq);
                    if (dataReturnProduct.length > 0) {

                        var table = $('#tbProd').DataTable();
                        $('#tbProd').dataTable().fnAddData(dataReturnProduct);
                        $('#tbProd').dataTable().fnDraw();

                        //table.on('order.dt search.dt', function () {
                        //    table.column(0, {search: 'applied', order: 'applied'}).nodes().each(function (cell, i) {
                        //        cell.innerHTML = i + 1;
                        //    });
                        //}).draw();
                    }
                    if (dataReturnPackage.length > 0) {

                        var tablePKG = $('#tbPackage').DataTable();
                        $('#tbPackage').dataTable().fnAddData(dataReturnPackage);
                        $('#tbPackage').dataTable().fnDraw();

                        //tablePKG.on('order.dt search.dt', function () {
                        //    tablePKG.column(0, {search: 'applied', order: 'applied'}).nodes().each(function (cell, i) {
                        //        cell.innerHTML = i + 1;
                        //    });
                        //}).draw();
                    }
                }

            }, function (err) {
                console.log(err);
            });


    }

    var prepareItemData = function () {
        var data = table.rows().data();

        $('#tbItem').DataTable().clear().draw();
        $('#ddlSelectProd').find('option').remove();
        $scope.lstItemPrepare.forEach(function (obj) {
            var sumTotabl = 0;
            var objFilter = _.filter(data, {product_ref: obj.product_id});
            objFilter.forEach(function (item) {
                sumTotabl += item.total_amt;
            });
            obj.total_amt = sumTotabl;
            obj.balance_amt = sumTotabl - obj.sumsell_amt;
        });
        initDDL();
        $("[id^=pnlEntryData]").show();
    }

    var initDDL = function () {
        $('#ddlSelectProd').find('option').remove();
        var lstItem = _.filter($scope.lstItemPrepare, function (o) {
            return o.balance_amt > 0;
        })
        lstItem.forEach(function (obj) {
            $('#ddlSelectProd').append("<option value=" + obj.product_id + ">" + obj.product_name + "</option>")
        });
        $("#ddlSelectProd").val($("#ddlSelectProd option:first").val());
        ddlProdChange($("#ddlSelectProd"));

        //var objFilter = _.filter($scope.lstItemPrepare, {balance_amt: 0});
        //objFilter.forEach(function (obj) {
        //    $('#ddlSelectProd').find('[value="' + obj.product_id + '"]').remove();
        //});
        //ddlProdChange($('#ddlSelectProd'));
    }

    var validateBalance = function () {
        var sPrepare = 0;

        $scope.lstItemPrepare.forEach(function (obj) {
            sPrepare += obj.total_amt;
        });

        var dataItem = tableItem.rows().data().toArray();
        var sItem = 0;
        dataItem.forEach(function (obj) {
            sItem += obj.quantity;
        });
        if (sPrepare != sItem) {

            dialogService.messageDialog("เกิดข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้ รายการขายสินค้าไม่ครบถ้วน ");
            return false;
        }
        return true;
    }

    var addItem = function (objItemPrepare, item_amt, arrears_price) {
        //var objSelect = _.head(_.filter($scope.lstItemPrepare, {product_id:objItemPrepare.product_id}));
        item_amt = numeral(item_amt)._value;
        item_amt = (item_amt > objItemPrepare.balance_amt ? objItemPrepare.balance_amt : item_amt)
        var isAddItem = true;
        var objData = {};
        $('#tbItem').DataTable().rows(function (idx, data, node) {
            if (data.product_id === objItemPrepare.product_id && data.customer_id === $scope.itemInfo.customer_id) {

                isAddItem = false;
                objData = data;
                data.quantity += item_amt;
                objData.arrears_price = arrears_price;//numeral($("#txtArrearAmt").val())._value;
                objData.sum_price = (objData.quantity * objData.price) - objData.arrears_price;
                $('#tbItem').DataTable().row(idx).data(objData).draw();
            }
        });
        if (isAddItem) {
            objData = {
                customer_id: $scope.itemInfo.customer_id,
                customer_name: $scope.itemInfo.customer_name,
                product_id: objItemPrepare.product_id,

                product_name: objItemPrepare.product_name,
                quantity: item_amt,
                price: objItemPrepare.price,
                sum_price: 0,
                arrears_price: arrears_price, // numeral($("#txtArrearAmt").val())._value,
                product_ref: objItemPrepare.product_ref,
                retrun_requisition_id: 0,
                order_no: 0
            };
            objData.sum_price = (objData.quantity * objData.price) - objData.arrears_price;

            $('#tbItem').dataTable().fnAddData(objData);
            $('#tbItem').dataTable().fnDraw();
        }
        $("#txtArrearAmt").val(0);
        fncManipulateItemRemain(objItemPrepare.product_id, -1, item_amt);
        $scope.itemInfo.quantity = 0;
        $scope.itemInfo.arrears_price = 0;
    };
    $scope.addItemRemainAll = function () {

        _.filter($scope.lstItemPrepare, function (o) {
            return o.balance_amt > 0;
        })
            .forEach(function (obj) {
                addItem(obj, obj.balance_amt, $scope.itemInfo.arrears_price);
            });


        initDDL();
        $("#prodRemantAmt").html(0);
    };

    $scope.changeQTY = function () {

        //_.filter($scope.lstItemPrepare, function (o) {
        //    return o.balance_amt > 0;
        //})
        //    .forEach(function (obj) {
        //        addItem(obj, obj.balance_amt);
        //    });
        //
        //
        //initDDL();
        //$("#prodRemantAmt").html(0);
        $scope.itemInfo.quantity = numeral($("#prodRemantAmt").html())._value < $("#txtQTY").val() ? numeral($("#prodRemantAmt").html())._value : $("#txtQTY").val();
    };

    var ddlProdChange = function (obj) {
        var prodId = numeral($(obj).val())._value;
        var objSelect = _.head(_.filter($scope.lstItemPrepare, {product_id: prodId}));
        if (objSelect != undefined) {
            $("#prodRemantAmt").html(objSelect.balance_amt);
        } else {
            $("#prodRemantAmt").html(0);
        }
    }

    var fncManipulateItemRemain = function (prodId, sign, amt) {
        var objFilter = _.head(_.filter($scope.lstItemPrepare, {product_id: prodId}));
        // sign == 1 ค่าบวก , sign == -1 ค่าลบ
        objFilter.balance_amt = objFilter.balance_amt + (amt * sign);

        var iCount = _.filter($scope.lstItemPrepare, function (o) {
            return o.balance_amt > 0;
        }).length;
        if (iCount == 0) {

            $("[id^=pnlEntryData]").hide();
        } else {
            $("[id^=pnlEntryData]").show();
        }
    };
    var fncSummary = function () {
        //var table = $('#tbProd').DataTable();
        var data = table.rows().data().toArray();
        var dataPKG = tablePKG.rows().data().toArray();
        var dataItem = tableItem.rows().data().toArray();

        var sumQTY = 0, price_net = 0;

        //data.forEach(function (obj) {
        //    sumQTY += obj.quantity;
        //});
        dataItem.forEach(function (obj) {
            sumQTY += obj.quantity;
            price_net += obj.sum_price;
        });
        $scope.reqData.sum_quantity = sumQTY;
        $scope.reqData.price_net = price_net;
        //var postData = {
        //    _master: $scope.reqData,
        //    _lstProducts: data,
        //    _lstPackages: dataPKG,
        //    _lstItems: dataItem,
        //
        //}
    }
    var getPriceAgency = function (cus_id) {
        productService.getPrice(cus_id)
            .then(function (response) {
                if (response.length > 0) {
                    lstPriceAgency = response;
                    console.log(lstPriceAgency);
                    $scope.lstItemPrepare.forEach(function (obj) {
                        var objPriceAgency = _.head(_.filter(lstPriceAgency, {product_id: obj.product_id}));

                        obj.price = objPriceAgency.price;
                    });
                    initDDL();
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
});


