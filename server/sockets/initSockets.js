var log = require('../util/logger').logger;

var initSockets = function(io) {

  io.on('connection', function(socket) {
    log.info('Connected socket: ' + socket.id);

    socket.on('disconnect', function() {
      log.info('Disconnected socket: ' + socket.id);
    });
  });

}

module.exports = initSockets;
