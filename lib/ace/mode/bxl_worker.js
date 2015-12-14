define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var Mirror = require("../worker/mirror").Mirror;

var BxlWorker = exports.BxlWorker = function(sender) {
    Mirror.call(this, sender);
    this.setTimeout(250);
    this.setOptions();
};

oop.inherits(BxlWorker, Mirror);

(function() {
    this.setOptions = function(options) {
        this.options = options || {
            host: "http://incubator.devel.lan:18080",
            project: "blox-platform/generix/ide/sk/ide",
            service: "codeValidationPage/_validate",
            parameter: "sourceCode"
        };
        this.doc.getValue() && this.deferredUpdate.schedule(100);
    };

    this.changeOptions = function(newOptions) {
        oop.mixin(this.options, newOptions);
        this.doc.getValue() && this.deferredUpdate.schedule(100);
    };

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
        formData.append(this.options.project + "/" + this.options.service + "/" + this.options.parameter, value);
        xhr.open("POST", this.options.host + "/" + this.options.project + "/" + this.options.service, true);
        xhr.responseType = "json";
    
        xhr.send(formData);
    };
}).call(BxlWorker.prototype);

});
