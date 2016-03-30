define(function(require, exports, module) {
"use strict";

var TokenIterator = require("../token_iterator").TokenIterator;


var BxlCompletions = function() {

};

(function() {

    this.identifierRegexps = [/[a-zA-Z_0-9\-\u00A2-\uFFFF]/];

    function index(object, prop) {
        if (object && object.hasOwnProperty(prop)) {
            return object[prop]
        } else {
            return undefined
        }
    }

    function isPathSeparator(token) {
        // console.log("isPathSeparator:", token);
        return (token.value === "/" && token.type !== "comment.line");
    }

    function isPathSegment(token) {
        // console.log("isPathSegment:", token);
        return (token.type === "identifier.tree" || token.type === "variable.language");
    }

    function isRootPath(token) {
        return (token.type === "variable.language");
    }

    this.getCompletions = function(editor, session, pos, prefix, callback) {
        this.getKeywordCompletions(editor, session, pos, prefix, callback);
        this.getPathsCompletions(editor, session, pos, prefix, callback);
        this.getOperationCompletions(editor, session, pos, prefix, callback);
    }

    this.getPathsCompletions = function(editor, session, pos, prefix, callback) {
        var iterator = new TokenIterator(session, pos.row, pos.column);
        var token = iterator.getCurrentToken();

        var path = [];
        var relativePath = false;

        if (token) {
            //console.log(token);
            if (isPathSegment(token)) {
                token = iterator.stepBackward();
            } else if (isPathSeparator(token)) {
                relativePath = true; // possibility
            }
        }

        while (token && (isPathSeparator(token) || isPathSegment(token))) {
            //console.log(token);
            if (isPathSegment(token)) {
                path.unshift(token.value);
            }

            if (isRootPath(token)) {
                relativePath = false;
            }
            token = iterator.stepBackward();
        }

        var staticPaths = getStaticPathsForCompletions();
        var dynamicPaths = getDynamicPathsForCompletion(session);

        var staticSubtree = path.reduce(index, staticPaths);
        var dynamicSubtree = path.reduce(index, dynamicPaths);

        if (staticSubtree || relativePath) {
            var completions = Object.keys(staticSubtree).map(function(key) {
                return {
                    caption: key,
                    snippet: key,
                    meta: "id",
                    score: 800
                }
            });

            callback(null, completions);
        }

        if (dynamicSubtree || relativePath) {
            var completions = Object.keys(dynamicSubtree).map(function(key) {
                return {
                    caption: key,
                    snippet: key,
                    meta: "id",
                    score: 900
                }
            });

            callback(null, completions);
        }
    };

    function getStaticPathsForCompletions() {
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
            "in": {"expand":0,"type":{"tailor":0,"file":0}},
            "out": {
                "output": 0
            }
        };

        if (window.blox && window.blox.__autocomplete__) {
            var obj = window.blox.__autocomplete__
        } else {
            var obj = demo;
        }

        return obj;
    }

    function getDynamicPathsForCompletion(session) {
        var iterator = new TokenIterator(session, 0, 0);
        var token = iterator.getCurrentToken();
        var gotTreeIdentifier = false;
        var path = [];
        var paths = [];

        while (token) {
            if (gotTreeIdentifier) {
                if (isPathSegment(token)) {
                    path.push(token.value);
                } else if (isPathSeparator(token)) {
                    // pass
                } else {
                    gotTreeIdentifier = false;
                    paths.push(path);
                    path = [];
                }
            } else {
                if (isRootPath(token)) {
                    gotTreeIdentifier = true;
                    path.push(token.value);
                }
            }

            token = iterator.stepForward();
        }

        return pathsToObject(paths);
    }

    function pathsToObject(paths) {
        var obj = {};

        paths.forEach(function(path){
            var p = obj;
            for (var i = 0; i < path.length; i++) {
                    if (p.hasOwnProperty(path[i])) {
                        p = p[path[i]];
                    } else {
                        p[path[i]] = {};
                        p = p[path[i]];
                    }
                    
                }    
        });

        return obj;
    }

    this.getKeywordCompletions = function(editor, session, pos, prefix, callback) {
        var completions = session.$mode.$keywordList.map(function(word) {
            return {
                caption: word,
                snippet: word,
                score: 500,
                meta: "keyword"
            };
        });

        callback(null, completions);
    }

    this.getOperationList = function() {
        var operations = {
            "getDisplayContent": {
                "in": {
                    "urlPath": 0,
                    "urlContext": 0,
                    "paramTree": 0,
                    "sessionTree": 0,
                    "attrKey": 0,
                    "attrData": 0,
                    "rowData": 0,
                    "rowErrors": 0
                },
                "out": {
                    "content": 0,
                    "attrData": 0,
                    "rowData": 0,
                    "rowErrors": 0
                }
            },
            "getEditContent": {
                "in": {},
                "out": {}
            },
            "getHiddenContent": {
                "in": {},
                "out": {}
            },
            "_getContent": {
                "in": {},
                "out": {}
            }
        };

        if (window.blox && window.blox.__autocomplete__ && window.blox.__autocomplete__.this) {
            var obj = window.blox.__autocomplete__.this
        } else {
            var obj = operations;
        }

        return obj;
    }


    this.getOperationCompletions = function(editor, session, pos, prefix, callback) {
        var operations = this.getOperationList();

        var iterator = new TokenIterator(session, pos.row, pos.column);
        var token = iterator.getCurrentToken();

        // console.log(token);

        if (token && token.type === "support.function.operation") {
            //console.log("mam meno");
            token = iterator.stepBackward();
        }

        if (token && token.type === "keyword.operator" && token.value === ".") {
            // console.log("mam bodku")
            token = iterator.stepBackward();

            if (token && token.type === "keyword" && token.value === "this") {
                // console.log("mam this")
                token = iterator.stepBackward();

                if (token && token.type === "support.function.module" && token.value === "$") {
                    // console.log("mam dolar")
                    var completions = Object.keys(operations).map(function(key) {
                        var inConstraints = operations[key].hasOwnProperty("in") ? Object.keys(operations[key].in).map(function(key) {
                            return "&nbsp;/" + key + "<br>"
                        }).join("") : "";

                        if (inConstraints !== "") {
                            inConstraints = "<hr><i>Input Constraints:</i><br>" + inConstraints
                        }

                        var outConstraints = operations[key].hasOwnProperty("out") ? Object.keys(operations[key].out).map(function(key) {
                            return "&nbsp;/" + key + "<br>"
                        }).join("") : "";

                        if (outConstraints !== "") {
                            outConstraints = "<hr><i>Output Constraints:</i><br>" + outConstraints
                        }

                        if (inConstraints !== "" && outConstraints !== "") {
                            var operationTitle = "Operation <b>" + key + "</b>"
                        } else {
                            var operationTitle = "";
                        }

                        if (operationTitle !== "") {
                            var docHTML = operationTitle + inConstraints + outConstraints;
                        } else {
                            docHTML = null
                        }

                        return {
                            caption: key,
                            snippet: key,
                            meta: "operation",
                            docHTML: docHTML,
                            score: 1000
                        }
                    });

                    callback(null, completions);
                }
            }
        }
    }

}).call(BxlCompletions.prototype);

exports.BxlCompletions = BxlCompletions;
});
