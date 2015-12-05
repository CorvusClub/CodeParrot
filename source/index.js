var CodeMirror = require('codemirror');
function init() {
  console.log("hello world");
}

window.addEventListener("load", function() {
  var textarea = document.getElementById("text");
  var codeMirrorInstance = CodeMirror.fromTextArea(textarea);
  init();
});
