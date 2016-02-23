define(function(require, exports, module) {
"use strict";

var TokenIterator = require("../token_iterator").TokenIterator;


var BxlCompletions = function() {

};

(function() {

    function index(object, prop) {
        if (object && object.hasOwnProperty(prop)) {
            return object[prop]
        } else {
            return undefined
        }
    }

    var demo = {
        "data": {
            "pattern": {
                "name": 0,
                "attr": 0,
                "items": {
                    "subitem": {
                        "name": 0,
                        "value": 0
                    }
                }
            }
        },
        "cfg": {
            "name": 0
        },
        "in": 0,
        "out": {
            "output": 0
        }
    };

    if (window.blox && window.blox.__autocomplete__) {
        demo = window.blox.__autocomplete__
    }

    function isPathSeparator(token) {
        return (token.type === "keyword.operator" || token.type === "identifier.tree.separator") && (token.value === "/");
    }

    function isPathSegment(token) {
        return (token.type === "identifier.tree" || token.type === "variable.language");
    }

    this.getCompletions = function(state, session, pos, prefix) {
        var iterator = new TokenIterator(session, pos.row, pos.column);
        var token = iterator.getCurrentToken();

        var path = [];

        if (token && isPathSegment(token)) {
            token = iterator.stepBackward();
        }

        while (token && (isPathSeparator(token) || isPathSegment(token))) {
            if (isPathSegment(token)) {
                path.unshift(token.value);
            }
            token = iterator.stepBackward();
        }

        var subtree = path.reduce(index, demo);

        if (!subtree) {
            return [];
        }

        var completions = Object.keys(subtree).map(function(key) {
            var sub = (typeof subtree[key] === "object");
            return {
                caption: key + (sub ? "/" : ""),
                snippet: key + (sub ? "/" : ""),
                meta: "bxl",
                score: 100,
                completer_: {
                    insertMatch: function(editor, data) {
                        console.log("YAY!"); console.log(data);
                    }
                }
            }
        });

        return completions;
    };

}).call(BxlCompletions.prototype);

exports.BxlCompletions = BxlCompletions;
});
