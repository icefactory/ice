
"use strict";

IceFactory.factory("handlerService", function ($http, $q, $rootScope, $window) {
    //--------------------------------------------------------------------------------
    //
    // Handler
    //
    //--------------------------------------------------------------------------------
    //
    // Error Handler
    function handlerError(response) {
        let language = new Language();
        // let resource = new Resource();

        if (response.status === 400 && response.statusText === "Bad Request") {
            response.data.displayMessage = language.isThai() ? response.data.messageLocal : response.data.message;
        }
        else if (response.status === 401 && response.statusText === "Unauthorized") {
            //
            // Connect server ไม่ได้ หรือ User หมดอายุ ให้ User ไป Login ใหม่
            $rootScope.authenticationData = {};
            $rootScope.menus = {};

            $window.location.href = "login.html";
        }
        else if (!angular.isObject(response.data) || !response.data.error || response.status === -1) {
            let error = {
                statusCode: 503,
                error: "Service Unavailable",
                displayMessage: 'เครื่องแม่ข่ายยังไม่ให้บริการในปัจจุบัน อันเนื่องจากการใช้งานเกินพิกัดหรืออยู่ในระหว่างการบำรุงรักษา'
            };

            return ($q.reject(error));
        }
        else if (response.data.message === undefined || response.data.message == null) {
            response.data.displayMessage = response.data.error;
        }

        return ($q.reject(response.data));
    }

    //
    // Success Handler
    function handlerSuccess(response) {
        return (response.data);
    }

    return ({
        handlerError: handlerError,
        handlerSuccess: handlerSuccess
    });
});