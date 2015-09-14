define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var Mirror = require("../worker/mirror").Mirror;

var BxlWorker = exports.BxlWorker = function(sender) {
    Mirror.call(this, sender);
    this.setTimeout(250);
};

oop.inherits(BxlWorker, Mirror);

(function() {
    this.onUpdate = function() {
        var worker = this;

        var value = this.doc.getValue();
        var results = [];
        var xhr = new XMLHttpRequest();
        
        xhr.onreadystatechange = function() {
            if ((xhr.readyState == 4) && (xhr.status == 200)) {
                //console.log(xhr.response);
                results = xhr.response;

                var errors = [];
        
                for (var i = 0; results != null && i < results.length; i++) {
                    var error = results[i];
                    errors.push({
                        row: error.line - 1,
                        column: error.column,
                        text: atob(error.message),
                        type: error.type
                    });
                }
                worker.sender.emit("lint", errors);
            }
        }
        
        var formData = new FormData;
        var baseUrl = "blox-platform/generix/setup2/sk/ide/codeValidationPage/_validate";
        //formData.append("blox-platform/generix/test/en/app/codeValidatorPage/codeValidator/sourceCode", value);
        formData.append(baseUrl + "/sourceCode", value);

        //  http://teach.devel.lan:18080/blox-platform/generix/test/en/app/codeValidatorPage/codeValidator"
        var url = "http://incubator.devel.lan:18080/" + baseUrl;
        xhr.open("POST", url, true);
        xhr.responseType = "json";
    
        xhr.send(formData);
    };
}).call(BxlWorker.prototype);

});
