"use strict";

//--------------------------------------------------------------------------------//
//
// Dialog Product Controller
//
//--------------------------------------------------------------------------------//
angular.module('IceFactory').controller("DialogProductStockTranController", function ($rootScope, $scope, $state, $timeout, $uibModalInstance, $stateParams, $uibModal, notificationService, dialogService, productStockService) {
    //------------------------------------------------------------------------------------------------
    //
    //
    // Variable for this controller
    //
    //
    //------------------------------------------------------------------------------------------------


//or change it into a date range picker
//    $('.date-picker').datepicker({
//        autoclose: true,
//        todayHighlight: true
//    })
    $scope.today = moment().format("DD/MM/YYYY");
    ;
    var colDefineDialog = [
            {"title": "#", "width": "30px", "className": "align-center", "data": null, bSortable: false},
            {"title": "รหัส", "data": "stock_trn_id", bVisible: false},
            {"title": "รหัสสินค้า", "className": "text-center", "data": "product_id", "width": "80px"},
            {"title": "รหัสสินค้า", "className": "text-center", "data": "createDate", "width": "80px", bVisible: false},
            {
                "title": "เวลาบันทึก",
                "data": "createDate",
                "type": "date ",
                "render": function (value) {
                    if (value === null) return "";
                    //return value.replace("T", " ");
                    return moment(new Date(value)).format("HH:mm:ss")
                    //return String(dt.getDate()).padStart(2, '0')  + "/" + String((dt.getMonth() + 1)).padStart(2, '0') + "/" + dt.getFullYear() ;
                },
            },
            {
                "title": "ยอดยกมา",
                "data": "forward_amt",
                className: "text-right"/*, render: $.fn.dataTable.render.number(',', '.', 0, '')*/
            },
            //{"title": "ซื้อสินค้า", "data": "createDate" ,width:"150px" /*,render: $.fn.dataTable.moment('DD/MM/YYYY HH:mm')*/},
            {
                "title": "รายการ",
                "width": "50px",
                className: "text-center",
                bSortable: false,
                mRender: function (data, type, row, meta) {
                    if (row.from_action.indexOf("STK") > -1) {
                        return '<span class="label label-success">ผลิตเพิ่ม</span>'
                    } else if (row.from_action.indexOf("PCH") > -1) {
                        return '<span class="label label-primary">สั่งซื้อเพิ่ม</span>'
                    } else if (row.from_action.indexOf("RTN") > -1) {
                        return '<span class="label label-info">คืนสินค้า</span>'
                    } else if (row.from_action.indexOf("APR") > -1) {
                        return '<span class="label label-danger">เบิกสินค้า</span>'
                    } else if (row.from_action.indexOf("POS") > -1) {
                        return '<span class="label label-warning">ขายหน้าโรง</span>'
                    } else if (row.from_action.indexOf("POS") > -1) {
                        return '<span class="label label-pink">ไปส่ง</span>'
                    } else {
                        //return '<span class="label label-success">ผลิตเพิ่ม</span>'
                        return ''
                    }

                }
            },
            {
                "title": "จำนวน",
                "data": "item_amt",
                className: "text-right"/*, render: $.fn.dataTable.render.number(',', '.', 0, '')*/
            },
            {"title": "คงเหลือ", "data": "remain_amt", className: "text-right"},
            {"title": "หน่วย", "data": "unit_name"},
            {"title": "หน่วย", "data": "unit_id", bVisible: false},

        ]
        ;


//------------------------------------------------------------------------------------------------
//
//
// AngularJs Events
//
//
//------------------------------------------------------------------------------------------------
    $uibModalInstance.rendered.then(function () {


        var table = $('#tbData').DataTable({
            "paging": true,
            "searching": false,
            //"scrollX": true,
            //"scrollCollapse": true,
            //"scrollY": true,
            "destroy": true,
            //"searching": true,
            "ordering": true,
            "processing": false,
            "serverSide": false,
            "columns": colDefineDialog,
            "autoWidth": true,
            "data": [],
            "order": [[3, 'desc']]
        });
        $scope.btnSearch();
        //$('.date-picker').datepicker({
        //    autoclose: true,
        //    todayHighlight: true
        //})
        $('.date-picker').datepicker({
            autoclose: true,
            todayHighlight: true
        });

    });
//------------------------------------------------------------------------------------------------
//
//
// Page Events
//
//
//------------------------------------------------------------------------------------------------
    $scope.btnCancelClicked = function () {
        $uibModalInstance.close(null);
    };

    $scope.btnSearch = function () {
        var data = {
            product_id: $scope.param.product_id,
            product_name: "",
            trans_date: moment($scope.today, 'DD/MM/YYYY').format("YYYY-MM-DD HH:mm:ss")
        };
        console.log(data);
        debugger;
        productStockService.getview(data).then(function (result) {

            //console.log(result);
            if (result.length > 0) {

                var table = $('#tbData').DataTable();
                $('#tbData').DataTable().clear().draw();
                $('#tbData').dataTable().fnAddData(result);
                //$('#tbData').dataTable().fnDraw();


                table.on('order.dt search.dt', function () {
                    table.column(0, {search: 'applied', order: 'applied'}).nodes().each(function (cell, i) {
                        cell.innerHTML = i + 1;
                    });
                }).draw();

                $('#tbData tbody').on('click', 'tr', function () {
                    if ($(this).hasClass('selected')) {
                        $(this).removeClass('selected');
                    }
                    else {
                        table.$('tr.selected').removeClass('selected');
                        $(this).addClass('selected');
                    }
                });
            }
        }, function (err) {
            console.log(err);
        });
    };

    /*

     $scope.btnSaveClicked = function () {
     alert("save");

     console.log($scope.data);
     if($scope.action == "edit"){

     productService.update($scope.data).then(function (result) {
     //$scope.dataType = result ;
     console.log($scope.data);
     alert("success");

     // send data
     $uibModalInstance.close('hfdhg');
     }, function (err) {
     console.log(err);
     });
     }else{
     productService.insert($scope.data).then(function (result) {
     //$scope.dataType = result ;
     console.log($scope.data);
     alert("success");

     // send data
     $uibModalInstance.close();
     }, function (err) {
     console.log(err);
     });
     }
     };

     $scope.loadDataOptions = function () {
     };
     */


})
;

