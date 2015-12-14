define(function(require, exports, module) {
"use strict";

var BxlCompletions = function() {

};

(function() {

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

    this.getCompletions = function(state, session, pos, prefix) {
        console.log("State:", state);
        console.log("Prefix:", prefix);

        var token = session.getTokenAt(pos.row, pos.column);
        console.log(token);

        if (!token) {
            return []
        }

        var completions = [];

        if (token.type === "identifier.tree") {
            console.log("mám cestu v strome")
            var previousTokenPos = {row: pos.row, column: token.start};
            console.log("previousTokenPos", previousTokenPos)
            var previousToken = session.getTokenAt(previousTokenPos.row, previousTokenPos.column);
            console.log("previousToken", previousToken)
            if (previousToken.type === "variable.language") {
                var tree = previousToken.value;
                if (demo[tree]){
                    completions = demo[tree];
                }
            }
        }

        console.log(completions)

        return completions;
    };

}).call(BxlCompletions.prototype);

exports.BxlCompletions = BxlCompletions;
});
