"use strict";

IceFactory.factory("notificationService", function() {


    return ({
        options: {
            position: {
                pinned: true,
                top: 15,
                right: 15
            },
            stacking: "down",
            width: "30em",
            //autoHideAfter: 1000,
            templates: [
                {
                    type: "info",
                    template: "<div class='alert alert-dismissable'>" +
                    "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>" +
                    "<h4><i class='icon fa fa-info'></i> #=title#</h4>" +
                    "#= message #" +
                    "</div>"
                }, {
                    type: "success",
                    template: "<div class='alert alert-dismissable'>" +
                    "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>" +
                    "<h4><i class='icon fa fa-check'></i> #=title#</h4>" +
                    "#= message #" +
                    "</div>"
                }, {
                    type: "warning",
                    template: "<div class='alert alert-dismissable'>" +
                    "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>" +
                    "<h4><i class='icon fa fa-warning'></i> #=title#</h4>" +
                    "#= message #" +
                    "</div>"
                },
                {
                    type: "error",
                    template: "<div class='alert alert-dismissable'>" +
                    "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>" +
                    "<h4><i class='icon fa fa-ban'></i> #=title#</h4>" +
                    "#= message #" +
                    "</div>"
                }
            ]
        },
        info: function (scope, message) {
            let language = new Language();

            scope.notificationCenter.info({
                message: message,
                title: (language.isThai()) ? "ข้อมูล!" : "Info!"
            });
        },
        success: function(scope, message) {
            let language = new Language();

            scope.notificationCenter.success({
                message: message,
                title: (language.isThai()) ? "เสร็จสมบูรณ์!" : "Success!"
            });
        },
        warning: function(scope, message) {
            let language = new Language();

            scope.notificationCenter.warning({
                message: message,
                title: (language.isThai()) ? "คำเตือน!" : "Warning!"
            });
        },
        error: function(scope, message) {
            let language = new Language();

            scope.notificationCenter.error({
                message: message,
                title: (language.isThai()) ? "เกิดข้อผิดพลาด!" : "Error!"
            });
        }
    });
});