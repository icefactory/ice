"use strict";

IceFactory.factory("routeService", function ($http, $q, $rootScope, handlerService) {
    let uri = $rootScope.settings.apiUrl + "admin/route";


    //--------------------------------------------------------------------------------
    //
    // Model
    //
    //--------------------------------------------------------------------------------
    function model() {
        return {
            name: "",
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
    function search(param) {
        let request = $http.post(uri+"/search" , param);
        return (request.then(handlerService.handlerSuccess, handlerService.handlerError));
    }
    function getddl() {
        let request = $http.get(uri+"/getDDL");
        return (request.then(handlerService.handlerSuccess, handlerService.handlerError));
    }

    function getById(id) {
        /*  let request = $http.get(uri + "/" + id);
          return (request.then(handlerService.handlerSuccess, handlerService.handlerError));*/
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
    function insert(data) {
        /*  let request = $http.post(uri, data);
          return (request.then(handlerService.handlerSuccess, handlerService.handlerError));*/
    }

    //--------------------------------------------------------------------------------
    //
    // Update data
    //
    //--------------------------------------------------------------------------------
    function update(data) {
        /* let request = $http.put(uri + "/" + data.id, data);
         return (request.then(handlerService.handlerSuccess, handlerService.handlerError));*/
    }

    //--------------------------------------------------------------------------------
    //
    // Delete data
    //
    //--------------------------------------------------------------------------------
    function deleteProduct(ids) {
        /* let request = $http.delete(uri + "/" + ids);
         return (request.then(handlerService.handlerSuccess, handlerService.handlerError));*/
    }

    return ({
        model: model,
        get: get,
        insert: insert,
        update: update,
        deleteProduct: deleteProduct,
        getDs: getDs,
        getById: getById,
        initial : initial,
        getddl: getddl,
        search:search,
    });
});