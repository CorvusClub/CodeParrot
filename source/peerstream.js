var stream = require('stream');

class PeerStream extends stream.Duplex {
  /** Stream interface for PeerJS connections */
  constructor(peerConnection) {
    super({objectMode: true});
    this.peerConnection = peerConnection;
    this.peerConnection.on('data', data => {
      if (data.systemMessage) {
        this.emit('systemMessage', data);
        return;
      }
      this.push(data);
    });
  }
  /** We don't need to respond to a desire to read, but it has to be implemented, so noop */
  _read() {
  }
  /** called by nodejs when the stream is written to */
  _write(data, encoding, callback) {
    this.peerConnection.send(data);
    callback();
  }
  /** Send a non-gulf message (eg for syncing language) */
  sendSystemMessage(message) {
    message.systemMessage = true;
    this.write(message);
  }
}

module.exports = PeerStream;
