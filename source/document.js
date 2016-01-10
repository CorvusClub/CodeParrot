var gulfBindEditor = require('gulf-codemirror');
var gulf = require('gulf');
var textOT = require('ot-text').type;

var PeerStream = require('./peerstream');
var masterDebug = require('debug')('cp:master');
var clientDebug = require('debug')('cp:client');

class Document {
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
  setupAsClient(connectionToMaster) {
    connectionToMaster.on('open', () => {
      var masterLink = this.gulfDoc.masterLink();
      var masterStream = new PeerStream(connectionToMaster);
      masterLink.pipe(masterStream).pipe(masterLink);
    });
    this.connectionToMaster = connectionToMaster;
  }
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
      masterDebug(`Client connected: ${connection.id}`);
      var slaveLink = this.masterDoc.slaveLink();
      var slaveStream = new PeerStream(connection);
      slaveLink.pipe(slaveStream).pipe(slaveLink);
    });
  }
}

module.exports = Document;
