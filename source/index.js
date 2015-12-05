var CodeMirror = require('codemirror');
require('codemirror/mode/javascript/javascript.js');
function init() {
  console.log("hello world");
}

window.addEventListener("load", function() {
  var textarea = document.getElementById("text");
  var codeMirrorInstance = CodeMirror.fromTextArea(textarea, {
    theme: "seti",
    lineNumbers: true,
    autofocus: true,
    mode: "javascript"
  });
  init();
});
