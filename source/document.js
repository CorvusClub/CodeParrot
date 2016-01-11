var CodeMirror = require('codemirror');
require('codemirror/mode/meta');

var gulfBindEditor = require('gulf-codemirror');
var gulf = require('gulf');
var textOT = require('ot-text').type;

var PeerStream = require('./peerstream');

class Document {
  /** CodeMirror, gulf and peerjs document bindings all together */
  constructor(peer) {
    this.peer = peer;
    this.textarea = document.getElementById('text');
    this.codeMirrorInstance = CodeMirror.fromTextArea(this.textarea, {
      theme: 'seti',
      lineNumbers: true,
      autofocus: true
    });
    this.gulfDoc = gulfBindEditor(this.codeMirrorInstance);
  }
  /** If we're a client, we just need to hook up the peer connection to our gulf masterLink */
  setupAsClient(connectionToMaster) {
    connectionToMaster.on('open', () => {
      var masterLink = this.gulfDoc.masterLink();
      var masterStream = new PeerStream(connectionToMaster);
      masterLink.pipe(masterStream).pipe(masterLink);
    });
    this.connectionToMaster = connectionToMaster;
  }
  /** If we're the master, we need to hook up each client to a new gulf slaveLink */
  setupAsMaster() {
    gulf.Document.create(new gulf.MemoryAdapter(), textOT, this.codeMirrorInstance.getValue(), (err, doc) => {
      if (err) {
        return Promise.reject(err);
      }
      this.masterDoc = doc;
      var slaveLink = this.masterDoc.slaveLink();
      slaveLink.pipe(this.gulfDoc.masterLink()).pipe(slaveLink);
    });
    this.peer.on('connection', connection => {
      var slaveLink = this.masterDoc.slaveLink();
      var slaveStream = new PeerStream(connection);
      slaveLink.pipe(slaveStream).pipe(slaveLink);
    });
  }
}

module.exports = Document;
