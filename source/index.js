/* CodeParrot: A P2P synchronized code editor
 *
 * Copyright 2015 Corvus Club
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var Peer = require('peerjs');

var CodeMirror = require('codemirror');
require('codemirror/mode/javascript/javascript.js');
var AnimalId = require("adjective-adjective-animal");

var Menu = require('./menu');

var menuBar;
function setupInterface() {
  var textarea = document.getElementById("text");
  var codeMirrorInstance = CodeMirror.fromTextArea(textarea, {
    theme: "seti",
    lineNumbers: true,
    autofocus: true,
    mode: "javascript"
  });

  var bar = document.getElementById("menubar");
  menuBar = new Menu(bar, codeMirrorInstance);
}

function setupPeer(peerId) {
  console.log("Connecting as ID", peerId);
  var peer = new Peer(peerId, {key: 't7dmjiu85s714i'});
}

window.addEventListener("load", function() {
  setupInterface();
  AnimalId("pascal").then(setupPeer);
});
