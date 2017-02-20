var socket = require('socket.io-client')();

socket.init = function() {

  socket.on('connect', function() {
    console.log('connected');
  });

  socket.on('disconnect', function() {
    console.log('disconnected');
  });
}

module.exports = socket;
