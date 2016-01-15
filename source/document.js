var CodeMirror = require('codemirror');
require('codemirror/mode/meta');

var gulfBindEditor = require('gulf-codemirror');
var gulf = require('gulf');
var textOT = require('ot-text').type;

var PeerStream = require('./peerstream');

class Document extends require('events').EventEmitter {
  /** CodeMirror, gulf and peerjs document bindings all together */
  constructor(peer) {
    super();
    this.peer = peer;
    this.textarea = document.getElementById('text');
    this.codeMirrorInstance = CodeMirror.fromTextArea(this.textarea, {
      theme: 'seti',
      lineNumbers: true,
      autofocus: true
    });
    this.gulfDoc = gulfBindEditor(this.codeMirrorInstance);
  }
  /** Send a message to each connected client */
  sendMessage(message) {
    this.streams.forEach(stream => {
      stream.sendSystemMessage(message);
    });
  }
  /** If we're a client, we just need to hook up the peer connection to our gulf masterLink */
  setupAsClient(connectionToMaster) {
    connectionToMaster.on('open', () => {
      var masterLink = this.gulfDoc.masterLink();
      var masterStream = new PeerStream(connectionToMaster);
      masterLink.pipe(masterStream).pipe(masterLink);
      this.streams = [masterStream];
      masterStream.on('systemMessage', message => this.emit('systemMessage', message));
    });
    this.connectionToMaster = connectionToMaster;
  }
  /** If we're the master, we need to hook up each client to a new gulf slaveLink */
  setupAsMaster() {
    this.streams = [];
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
      this.streams.push(slaveStream);
      slaveStream.on('systemMessage', message => this.emit('systemMessage', message));
      this.sendMessage({
        message: 'changeLanguage',
        language: this.language
      });
    });
  }
}

module.exports = Document;
