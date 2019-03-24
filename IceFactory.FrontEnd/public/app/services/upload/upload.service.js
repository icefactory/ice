"use strict";

IceFactory.factory("uploadService", function ($http, $q, $rootScope, handlerService) {

    //--------------------------------------------------------------------------------
    //
    // Model
    //
    //--------------------------------------------------------------------------------

    function modelAttachFiles() {
        return {
            attachFileId : -1,
            fileUploadInfo : {},
            fileName : "",
            image : ""
        }
    }

    return ({
        modelAttachFiles: modelAttachFiles,
    });
});