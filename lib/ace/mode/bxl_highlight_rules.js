define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var BxlHighlightRules = function() {


	var docComment = "\\b(?:WARNING|FIXME|XXX|HACK|BUG|COMPENSATION|BARLA)\\b";
	var docComment2 = "TODO";
	var urlRegex = /https?:\/\/[^\s]+/;
	var docMention = "@[a-zA-Z0-9]+";
	var docIssue = "[A-Z]+-[0-9]+";

	var keywordMapper = this.createKeywordMapper({
	    // special keywords
        "keyword": "this|super|root|forkey|forval",
        // control keywords
        "keyword.control": "if|else|do|while|for|break|continue|switch|case|default|return|instanceof",
        // special trees
        "variable.language": "loc|in|out|cfg|data|tmp|__init__|src|dest|throw|try|catch|finally",
        // env tree is deprecated
        "variable.language.invalid.illegal": "env",
        // lang agents
        "support.function": "log|warning|error|info|java|compile|exec|stack|trace",
        // explicit types
        "storage.type.support.function": "bool|int|long|decimal|float|double|string|date|time|dateTime|path",
        // void
        "constant.language": "null|NULL|empty|EMPTY",
        // boolean
        "constant.language.boolean": "true|false",
    }, "unknown");

	this.$rules = {
	    "start": [ {
			token : "comment.line",
			regex : "\\/\\/",
			next  : "singlelineComment"
        }, {
			token : "comment.block",
			regex : "\\/\\*",
			next : "multilineComment"
		}, {
			token : "string.triple",
			regex : "'''",
			next  : "tripleQuotedString"
		}, {
			token : "string.single",
			regex : '[\']',
			next  : "singleQuotedString"
		}, {
		    token : "string.double",
		    regex : '"',
		    next  : "doubleQuotedString"
		}, {
			token : "constant.numeric", // number
			regex : "[-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]\\d+)?)?(L|l|F|f|D|d|bd|BD)?\\b"
		}, {
			token : ["identifier.tree.separator", "identifier.tree"], // tree paths
			regex : "(/)([\\w]+)"
		}, {
			token : "support.function.module", // module operation call
			regex : "(\\$\\$?)",
			next  : "operationCall"
		}, {
			token : "support.function.agent", // module operation call
			regex : "(\\w+)(\\.\\w+)+"
		}, {
			token : "keyword.operator",
			regex : "=\\[\\]|!|%|\/|\\*|\\-|\\+|\\.|&|~|\\^|<<|>>|==|=|:=|!=|<=|>=|>|<|&&|\\|\\||\\?|\\:"
		}, {
			token : "lparen",
			regex : "[[({]"
		}, {
			token : "rparen",
			regex : "[\\])}]"
		}, {
			token : "support.function.agent", // module operation call
			regex : "(\\w+)(\\.\\w+)+"
		}, {
			token : keywordMapper,
			regex : "[a-zA-Z_][a-zA-Z0-9_]*\\b"
		}],
		"multilineComment" : [ {
			token : "comment",
			regex : ".*?\\*\\/",
			next : "start"
		}, {
		    token : "comment.documentation",
            regex : docComment
		}, {
		    token : "comment.documentation.alternative",
            regex : docComment2
		}, {
		    token : "comment.documentation.mention",
		    regex : docMention
		}, {
		    token: "comment.markup.underline.link",
		    regex : urlRegex
		}, {
			token: "comment.documentation.issue",
			regex: docIssue
		}, {
			defaultToken : "comment"
		}],
		"singlelineComment": [{
		    token : "",
		    regex : "^",
		    next  : "start"
		}, {
		    token : "comment.documentation",
            regex : docComment
		}, {
		    token : "comment.documentation.alternative",
            regex : docComment2
		}, {
		    token : "comment.documentation.mention",
		    regex : docMention
		}, {
		    token: "comment.markup.underline.link",
		    regex : urlRegex
		}, {
			token: "comment.documentation.issue",
			regex: docIssue
		}, {
		    defaultToken: "comment.line"
		}],
		"singleQuotedString" : [{
			token : "variable.parameter",
			regex : "%%.*?%%"
		}, {
			token : "string.escaped",
			regex : "[\\\\]."
		}, {
			token : "string.single",
			regex : '[\']',
			next  : "start"
		}, {
			defaultToken : "string.single"
		}],
		"doubleQuotedString": [{
		    token : "variable.parameter",
			regex : "%%.*?%%"
		}, {
			token : "string.escaped",
			regex : "[\\\\]."
		}, {
			token : "string.double",
			regex : '["]',
			next  : "start"
		}, {
			defaultToken : "string.double"
		}],
		"tripleQuotedString"  : [{
			token : "string.triple",
			regex : "'''",
			next  : "start"
		}, {
			token : "variable.parameter",
			regex : "%%.*?%%"
		}, {
            defaultToken : "string.triple"
        }],
        "operationCall": [{
            token : function(dotOperator, operationName) { return ["keyword.operator", "support.function.operation"] },
            regex : "(\\.)([\\w]+)",
            next  : "start"
        }, {
            token : "keyword.operator",
            regex : "\\.",
            next  : "start"
        }, {
			token : keywordMapper,
			regex : "[a-zA-Z_][a-zA-Z0-9_]*\\b"
		}, {
			token : ["identifier.tree.separator", "identifier.tree"], // tree paths
			regex : "(/)([\\w]+)"
		}]
	};

};

oop.inherits(BxlHighlightRules, TextHighlightRules);

exports.BxlHighlightRules = BxlHighlightRules;

});