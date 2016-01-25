define(function(require, exports, module) {
"use strict";

var BxlCompletions = function() {

};

(function() {

    function index(obj,i) {
        if (obj && obj.hasOwnProperty(i)) {
            return obj[i]
        } else {
            return undefined
        }
        
    }

    var demo = {
        "data": {
            "pattern": {
                "name": "Meno patternu",
                "attr": true,
                "items": {
                    "subitem": {
                        "name": "meh",
                        "value": 23
                    }
                }
            }
        },
        "cfg": {
            "name": "something"
        },
        "in": null,
        "out": {
            "output": null
        }
    };

    if (window.blox && window.blox.__autocomplete__) {
        demo = window.blox.__autocomplete__
    }

    this.getCompletions = function(state, session, pos, prefix) { 

        var token = session.getTokenAt(pos.row, pos.column);

        if (!token) {
            // console.log("No token to match -> no completions.");
            return []
        }

        var completions = [];
        var tree, path, separator;

        if (token.type === "keyword.operator" && token.value === "/") { // got path separator
            separator = token.value;
            var pos = {row: pos.row, column: token.start};
            var token = session.getTokenAt(pos.row, pos.column);
        }

        if (token.type === "identifier.tree") { // got path in some tree
            path = token.value;
            pos = {row: pos.row, column: token.start};
            token = session.getTokenAt(pos.row, pos.column);
        }

        if (token.type === "variable.language" && token.value !== "tmp") { // got cfg, data, in, out
            tree = token.value;
        }

        tree = tree ? tree : "";
        path = path ? path : "";
        separator = separator ? separator : "";

        /*
        console.log("Tree – ", tree);
        console.log("Path – ", path);
        console.log("Sepa – ", separator);
        */

        var subtree = (tree + path).split('/').reduce(index, demo)
        
        if (typeof subtree === "undefined") {
            var meh = (tree + path).split('/')
            meh.pop()
            var subtree = meh.reduce(index, demo)    
        }

        function traverse(o, func, path, score) {
            if (typeof o === "object") {
                for (var i in o) {
                    path.push(i)
                    score = score - 1
                    func.apply(this, [i, o[i], path, score]);

                    if (o[i] !== null && typeof(o[i]) === "object") {
                        traverse(o[i], func, path, score);
                    }
                    path.pop()
                    score = score + 1
                }
            }
        }

        var completions = []

        traverse(subtree, function(k, v, p, s) {
            //console.log(k, v, p, s);
            var path = p.join("/")
            completions.push({
                caption: path,
                snippet: path,
                meta: "",
                score: s,
            })
        }, [], 100);

        // console.log(completions);

        return completions;
    };

}).call(BxlCompletions.prototype);

exports.BxlCompletions = BxlCompletions;
});
