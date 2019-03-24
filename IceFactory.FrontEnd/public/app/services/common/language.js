/**
 * Created by aem on 10/27/2016 AD.
 */
let Language = (function () {
    function Language() {
        this.enum = {
            thai: "Thai",
            eng: "English"
        };
    }

    Language.prototype.column = function (name) {
        let localization = (currentLanguage === this.enum.thai) ? "Local" : "";
        return name + localization;
    };

    Language.prototype.isThai = function () {
        return currentLanguage === this.enum.thai
    };

    Language.prototype.isEng = function () {
        return currentLanguage === this.enum.eng
    };

    Language.prototype.ddlCommonOptions = function () {
        return {
            dataSource: [{
                text: currentLanguage === this.enum.thai ? "ภาษาไทย" : "Thai",
                value: this.enum.thai
            }, {
                text: currentLanguage === this.enum.thai ? "ภาษาอังกฤษ" : "English",
                value: this.enum.eng
            }],
            dataTextField: "text",
            dataValueField: "value",
            filter: "contains",
            dataBound: function (e) {
                this.select(0)
            }
        };
    };

    return Language;
}());

let currentLanguage = new Language().enum.eng;