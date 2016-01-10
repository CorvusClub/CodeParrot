var stream = require('stream');
var debug = require('debug')('cp:PeerStream');

class PeerStream extends stream.Duplex {
  constructor(peerConnection) {
    super({objectMode: true});
    this.peerConnection = peerConnection;
    this.peerConnection.on('data', data => {
      debug('push', data);
      this.push(data);
    });
    debug("PeerStream constructed");
  }
  _read() {
    debug('_read()');
  }
  _write(data, encoding, callback) {
    debug('write', data);
    this.peerConnection.send(data);
    callback();
  }
  
}

module.exports = PeerStream;
