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
require('codemirror/mode/meta');
var animalId = require('adjective-adjective-animal');

var Menu = require('./menu');

class CodeParrot {
  /** Set up every piece of the UI */
  setupInterface() {
    this.textarea = document.getElementById('text');
    this.codeMirrorInstance = CodeMirror.fromTextArea(this.textarea, {
      theme: 'seti',
      lineNumbers: true,
      autofocus: true
    });

    this.bar = document.getElementById('menubar');
    this.menuBar = new Menu(this.bar, this.codeMirrorInstance);
    this.showWelcome();
  }

  /** Shows the welcome screen, connecting the UI to callbacks */
  showWelcome() {
    this.welcome = document.getElementById('welcome');
    if (location.hash) {
      let id = location.hash.slice(1);
      this.setupPeer(id);
      return;
    }
    this.welcome.classList.add('active');
    let connectButton = this.welcome.querySelector('button#connect');
    connectButton.addEventListener('click', () => {
      let peerId = this.welcome.querySelector('input[name="peerid"]').value;
      this.setupPeer(peerId);
    });
    let generateButton = this.welcome.querySelector('button#generateId');
    generateButton.addEventListener('click', () => {
      this.setupPeer();
    });
  }

  /** Hides the welcome screen with a nice fade animation */
  hideWelcome() {
    this.welcome.classList.add('fade');
    let listener = this.welcome.addEventListener('transitionend', () => {
      this.welcome.classList.remove('active');
      this.welcome.removeEventListener('transitionend', listener);
    });
  }

  /** Connect to our friend and establish the synchronization */
  setupPeer(peerId) {
    return new Promise((resolve, reject) => {
      return Promise.resolve(peerId || animalId('pascal')).then(myId => {
        this.peer = new Peer(myId, {key: 't7dmjiu85s714i'});
        this.peer.once('error', error => {
          if (error.type === 'unavailable-id') {
            console.log(`ID ${peerId} taken, so generating new ID and connecting to peer`);
            this.setupPeer().then(() => {
              location.hash = '#' + peerId;
              this.peer.connect(peerId);
              console.log(`Connecting to peer ${peerId}`);
              resolve(this.peer);
            });
          } else {
            reject(error);
          }
        });
        this.peer.once('open', () => {
          console.log(`Connection to PeerServer opened with ID ${myId}`);
          location.hash = '#' + myId;
          resolve(this.peer);
        });
        console.log(`Connecting to PeerServer as ID ${myId}`);
      });
    }).then(() => {
      this.hideWelcome();
    });
  }
}

window.addEventListener('load', function() {
  // for debugging/lazy dev purposes:
  window.codeparrot = new CodeParrot();
  window.CodeMirror = CodeMirror;

  window.codeparrot.setupInterface();
});
