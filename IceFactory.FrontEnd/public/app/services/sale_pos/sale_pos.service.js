"use strict";

IceFactory.factory("requisitionService", function ($http, $q, $rootScope, handlerService) {
    let uri = $rootScope.settings.apiUrl + "admin/requisition";


    //--------------------------------------------------------------------------------
    //
    // Model
    //
    //--------------------------------------------------------------------------------
    function model() {
        return {
            code: "",
            name: "",
            productGroupId: null,
            nameLocal: "",
            status: "",
        }
    }

    //--------------------------------------------------------------------------------
    //
    // Get data
    //
    //--------------------------------------------------------------------------------
    function initial(id) {
        /*let apiUrl = uri + "/initial";

         if (id) {
         apiUrl += "/" + id;
         }

         console.log("Call this api url : " + apiUrl);

         let request = $http.get(apiUrl);
         return (request.then(handlerService.handlerSuccess, handlerService.handlerError));*/
    }

    function get() {
        let request = $http.get(uri);
        return (request.then(handlerService.handlerSuccess, handlerService.handlerError));
    }

    function initReqByRoute(id) {
        let request = $http.get(uri + "/initReqByRoute/" + id);
        return (request.then(handlerService.handlerSuccess, handlerService.handlerError));
    }

    function searchReq(objFilter) {
        let request = $http.post(uri + "/searchRequisition", objFilter);
        return (request.then(handlerService.handlerSuccess, handlerService.handlerError));
    }

    function searchReqProduct(objFilter) {
        let request = $http.post(uri + "/searchReqProduct", objFilter);
        return (request.then(handlerService.handlerSuccess, handlerService.handlerError));
    }

    function getById(id) {
        let request = $http.get(uri + "/" + id);
        return (request.then(handlerService.handlerSuccess, handlerService.handlerError));
    }

    function getDs() {
        /*return new kendo.data.DataSource({
         batch: true,
         transport: {
         read: function (o) {
         get().then(function (response) {
         //console.log(response);
         o.success(response);
         }, function (err) {
         o.error(err.message);
         });
         }
         },
         });*/
    }

    //--------------------------------------------------------------------------------
    //
    // Insert data
    //
    //--------------------------------------------------------------------------------
    function saveData(data) {
        //console.log(data);
        let request = $http.post(uri + "/saveData", data);
        return (request.then(handlerService.handlerSuccess, handlerService.handlerError));
    }

    //--------------------------------------------------------------------------------
    //
    // Update data
    //
    //--------------------------------------------------------------------------------
    function update(data) {
        let request = $http.post(uri + "/updateData", data);
        return (request.then(handlerService.handlerSuccess, handlerService.handlerError));
    }

    //--------------------------------------------------------------------------------
    //
    // Delete data
    //
    //--------------------------------------------------------------------------------
    function deleted(id) {
        let request = $http.delete(uri + "/deleteData/" + id);
        return (request.then(handlerService.handlerSuccess, handlerService.handlerError));
    }

    return ({
        model: model,
        get: get,
        initReqByRoute: initReqByRoute,
        saveData: saveData,
        update: update,
        deleted: deleted,
        getDs: getDs,
        getById: getById,
        initial: initial,
        searchReq: searchReq,
        searchReqProduct: searchReqProduct
    });
});