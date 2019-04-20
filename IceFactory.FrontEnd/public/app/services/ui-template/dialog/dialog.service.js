"use strict";

//--------------------------------------------------------------------------------
//
// Dialog Controller
//
//--------------------------------------------------------------------------------
angular.module('IceFactory').controller("confirmDialogController", function ($scope, $uibModalInstance, dialogService, model) {
    $scope.dialogTitle = model.dialogTitle;
    $scope.dialogMessage = model.dialogMessage;
    //--------------------------------------------------------------------------------
    //
    //
    // Event Handler
    //
    //
    //--------------------------------------------------------------------------------
    $scope.btnOkClicked = function () {
        $uibModalInstance.close(model);
    };

    $scope.btnCancelClicked = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

//--------------------------------------------------------------------------------
//
// Dialog Service
//
//--------------------------------------------------------------------------------
IceFactory.factory("dialogService", function ($uibModal) {
    function confirmDialog(title, message, callback) {
        let dialog = $uibModal.open({
            animation: true,
            template: "" +
                /*"<div class='portlet light bordered'>" +
                 "   <div class='portlet-title'>" +
                 "      <div class='caption font-dark'>" +
                 "         <i class='fa fa-question-circle font-red-sunglo'></i>" +
                 "         <span class='caption-subject bold uppercase'>{{dialogTitle}}</span>" +
                 "      </div>" +
                 "      <div class='actions'>" +
                 "      </div>" +
                 "   </div>" +
                 "   <div class='portlet-body form'>" +
                 "      <div class='form-body'> " +
                 "         {{dialogMessage}}" +
                 "      </div>" +
                 "   </div>" +
                 "</div>" +
                 "<div class='modal-action'>" +
                 "         <button class='btn btn-primary ' type='button' ng-click='btnOkClicked()' autofocus>{{resource.message.yes}}</button>" +
                 "         <button class='btn btn-default ' type='button' ng-click='btnCancelClicked()'>{{resource.message.no}}</button>" +
                 "</div>"*/
            '<div class="modal-header"> <h2>{{dialogTitle}} </h2></div>' +
            '<div class="modal-body">' +
                '<h4 class="alert alert-info"> {{dialogMessage}}</h4>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button data-dismiss="modal" ng-click="btnCancelClicked();" aria-hidden="true" type="button" class="btn btn-primary" autofocus>ยกเลิก</button>' +
            '<button data-dismiss="modal" ng-click="btnOkClicked();" aria-hidden="true" type="button" class="btn btn-primary">ตกลง</button>' +
            '</div>'
            ,
            controller: "confirmDialogController",
            size: "md",
            backdrop: "static",
            resolve: {
                model: function () {
                    return {
                        dialogTitle: title,
                        dialogMessage: message
                    }
                }
            }
        });

        dialog.result.then(function (dialogResult) {
            debugger;
            return dialogResult;
            //callback(null, dialogResult);
        }, function (err) {
            callback(err, null);
        });
    }

    function messageDialog(title, message) {
        $uibModal.open({
            animation: true,
            template: "" +
                /*"<div class='portlet light bordered'>" +
                 "   <div class='portlet-title'>" +
                 "      <div class='caption font-dark'>"+
                 "         <i class='fa fa-question-circle font-red-sunglo'></i>"+
                 "         <span class='caption-subject bold uppercase'>{{dialogTitle}}</span>"+
                 "      </div>"+
                 "      <div class='actions'>"+
                 "      </div>"+
                 "   </div>"+
                 "   <div class='portlet-body form'>" +
                 "      <div class='form-body'> "+
                 "         {{dialogMessage}}" +
                 "      </div>" +
                 "   </div>"+
                 "</div>"+
                 "<div class='modal-action'>" +
                 "   <button class='btn btn-primary' type='button' ng-click='btnOkClicked()' autofocus>ตกลง</button>" +
                 "</div>"*/
                //'<div class="modal-dialog">' +
                //'<div class="modal-content">' +
            '<div class="modal-header"> <h2>{{dialogTitle}} </h2></div>' +
            '<div class="modal-body">' +
            '<h4 class="alert alert-success"> {{dialogMessage}}</h4>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button data-dismiss="modal" ng-click="btnOkClicked();" aria-hidden="true" type="button" class="btn btn-primary" autofocus> ตกลง</button>' +
                //'</div>' +
            '</div>'

            ,
            controller: "confirmDialogController",
            size: "md",
            backdrop: "static",
            resolve: {
                model: function () {
                    return {
                        dialogTitle: title,
                        dialogMessage: message
                    }
                }
            }
        });
    }

    return ({
        confirmDialog: confirmDialog,
        messageDialog: messageDialog
    });
});


//--------------------------------------------------------------------------------
//
// How to use
//
//--------------------------------------------------------------------------------
//
// dialogService.messageDialog("Test Title", "Test message");
//
// dialogService.confirmDialog("Test Title", "Test Message", function (err, result) {
//     if (result) {
//         //
//         // User click ok
//         console.log("Ok");
//     } else {
//         //
//         // User click cancel
//         console.log("Cancel");
//     }
// });