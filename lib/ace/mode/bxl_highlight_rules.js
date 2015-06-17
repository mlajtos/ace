define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var BxlHighlightRules = function() {

	var keywords = "this|super|root|forkey|forval"
	var controlKeywords = "if|else|while|for|break|continue|return"
	var trees = "loc|in|out|cfg|data|env|tmp|throw|try|catch|finally"
	var types = "bool|int|float|double"
	
	var docRegex = "\\b(?:TODO|FIXME|XXX|HACK|BUG)\\b"
	var urlRegex = /https?:\/\/[^\s]+/

	var keywordMapper = this.createKeywordMapper({
        "keyword": keywords,
        "keyword.control": controlKeywords,
        "variable.language": trees,
        "support.function": types
    }, "identifier.XXX");

	this.$rules = {
	    "start": [ {
			token : "comment.line", // single line comment
			regex : "\\/\\/",
			next  : "singlelineComment"
        }, {
			token : "comment.block", // multi line comment
			regex : "\\/\\*",
			next : "multilineComment"
		}, {
			token : "string", // triple
			regex : "'{3}",
			next  : "multilineString"
		}, {
			token : "string.double", // double
			//regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
			regex : '["]',
			next  : "singlelineString"
		}, {
			token : "constant.numeric", // number
			regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?(L|l|F|f|D|d)?\\b"
		}, {
			token : "constant.language.boolean", // boolean
			regex : "(?:true|false)\\b"
		}, {
			token : "constant.language", // null and empty tree
			regex : "(?:null|empty)\\b"
		},{
			token : "identifier.tree", // tree paths // language.variable
			regex : "(/[\\w]+)"
		}, /*{
			token : "support.function.module", // module operation call
			regex : "(\\$\\w+\\.\\w+)"
		}, */{
			token : "support.function.agent", // module operation call
			regex : "(\\w+\\.)(\\w+)"
		}, {
			token : keywordMapper,
			regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
		}, {
			token : "keyword.operator", // TODO precistit
			regex : "!|\\$|%|&|\/|\\*|\\-\\-|\\-|\\+\\+|\\+|\\.|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^="
		}, {
			token : "lparen",
			regex : "[[({]"
		}, {
			token : "rparen",
			regex : "[\\])}]"
		}],
		"multilineComment" : [ {
			token : "comment", // closing comment
			regex : ".*?\\*\\/",
			next : "start"
		}, {
		    token : "comment.doc.tag.storage.type",
            regex : docRegex
		}, {
		    token: "comment.markup.underline.link",
		    regex : urlRegex
		}, {
			defaultToken : "comment"
		}],
		"singlelineComment": [{
		    token : "",
		    regex : "$",
		    next  : "start"
		}, {
		    token : "comment.doc.tag.storage.type",
            regex : docRegex
		}, {
		    token: "comment.markup.underline.link",
		    regex : urlRegex
		}, {
		    defaultToken: "comment.line"
		}],
		"singlelineString" : [{
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
		"multilineString"  : [{
			token : "string",
			regex : "'{3}",
			next  : "start"
		}, {
			token : "variable.parameter",
			regex : "%%.*?%%"
		}, {
            defaultToken : "string"
        }]
	};

}

oop.inherits(BxlHighlightRules, TextHighlightRules);

exports.BxlHighlightRules = BxlHighlightRules;

});