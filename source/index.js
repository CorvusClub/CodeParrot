var CodeMirror = require('codemirror');
require('codemirror/mode/javascript/javascript.js');

var Menu = require('./menu');

var menuBar;
function init() {
  console.log("hello world");
  var bar = document.getElementById("menubar");
  menuBar = new Menu(bar);
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
