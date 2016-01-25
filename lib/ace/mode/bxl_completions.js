define(function(require, exports, module) {
"use strict";

var BxlCompletions = function() {

};

(function() {

    var demo2 = {
        "data": {
            "pattern": {
                "name": "aloha",
                "attr": "bla",
                "items": {
                    "subitem": {
                        "name": "Subitem",
                        "value": 3
                    }
                }
            }
        },
        "cfg": {
            "name": "Hello"
        }
    };

    var demo = {
        "data": [{
            caption: "pattern",
            snippet: "pattern",
            meta: "DATA",
            score: Number.MAX_VALUE
        }, {
            caption: "items",
            snippet: "stringAttr",
            meta: "DATA",
            score: Number.MAX_VALUE
        }],
        "in": [{
            caption: "urlContext",
            snippet: "urlContext",
            meta: "IN",
            score: Number.MAX_VALUE
        }],
        "out": [{
            caption: "content",
            snippet: "content",
            meta: "OUT",
            score: Number.MAX_VALUE
        }],
        "cfg": [{
            caption: "destroyWorld",
            snippet: "destroyWorld",
            meta: "CFG",
            score: Number.MAX_VALUE
        }]
    }

    this.xhr = new XMLHttpRequest();
    xhr.responseType = "json";

    this.xhr.onreadystatechange = function() {
        if ((xhr.readyState == 4) && (xhr.status == 200)) {
            console.log(xhr.response);
        }
    }

    this.getCompletionsFromService  = function() {
        var formData = new FormData;
        formData.append(this.options.project + "/" + this.options.service + "/" + this.options.parameter, value);
        xhr.open("POST", this.options.host + "/" + this.options.project + "/" + this.options.service, true);
        
        xhr.send(formData);
    }

    this.getCompletions = function(state, session, pos, prefix, callback) { 

        var token = session.getTokenAt(pos.row, pos.column);

        if (!token) {
            return []
        }

        var completions = [];
        var tree, path, separator;

        if (token.type === "keyword.operator") { // got path separator
            console.log("Path separator – ", token.value);
            separator = token.value;
            var pos = {row: pos.row, column: token.start};
            var token = session.getTokenAt(pos.row, pos.column);
        }

        if (token.type === "identifier.tree") { // got path in some tree
            console.log("Path – ", token.value);
            path = token.value;
            pos = {row: pos.row, column: token.start};
            token = session.getTokenAt(pos.row, pos.column);
        }

        if (token.type === "variable.language") { // got cfg, data, in, out
            console.log("Tree – ", token.value);
            tree = token.value;
        }

        if (demo[tree]){
            completions = demo[tree];
        }

        tree = tree ? tree : "";
        path = path ? path : "";
        separator = separator ? separator : "";

        var destination = tree + path + separator;
        console.log("Input for completer: ", destination);

        $.getJSON("http://incubator.devel.lan:18080/blox-platform/generix/ide/sk/ide/codeCompletionsPage/_complete",
                {"query": destination},
                function(response) {
                    console.log(response)
                })

        // console.log(completions)

        return completions;
    };

}).call(BxlCompletions.prototype);

exports.BxlCompletions = BxlCompletions;
});
