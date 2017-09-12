define(function(require, exports, module) {

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var BxlHighlightRules = require("./bxl_highlight_rules").BxlHighlightRules;
var WorkerClient = require("../worker/worker_client").WorkerClient;
var BxlBehaviour = require("./behaviour/bxl").BxlBehaviour;
var FoldMode = require("./folding/cstyle").FoldMode;
var MatchingBraceOutdent = require("./matching_brace_outdent").MatchingBraceOutdent;
var BxlCompletions = require("./bxl_completions").BxlCompletions;

var Mode = function() {
    this.HighlightRules = BxlHighlightRules;
    this.foldingRules = new FoldMode();
    this.$behaviour = new BxlBehaviour();
    this.$outdent = new MatchingBraceOutdent();
    this.completer = new BxlCompletions();

    var highlighter = new BxlHighlightRules();
    this.$keywordList = highlighter.$keywordList;
};
oop.inherits(Mode, TextMode);

(function() {

    this.lineCommentStart = "//";
    this.blockComment = {start: "/*", end: "*/"};

	this.createWorker = function(session) {
        var worker = new WorkerClient(["ace"], "ace/mode/bxl_worker", "BxlWorker");
        worker.attachToDocument(session.getDocument());

        worker.on("lint", function(results) {
            session.setAnnotations(results.data);
        });

        worker.on("terminate", function() {
            session.clearAnnotations();
        });

        worker.call("changeOptions", [{
            host: window.location.origin, // blox.constant.
            project: blox.constant.BLOX_IDE_URL,
            service: "codeValidationPage/_validate",
            parameter: "sourceCode"
        }]);

        return worker;
    }

    this.$id = "ace/mode/bxl";

}).call(Mode.prototype);

exports.Mode = Mode;
});