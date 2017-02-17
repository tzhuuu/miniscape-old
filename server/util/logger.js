var winston = require('winston');
var expressWinston = require('express-winston');

var formatter = function(options) {
  // Return string will be passed to logger.
  return options.timestamp() +' '+ options.level.toUpperCase() +' '+ (options.message ? options.message : '') +
    (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
};

var timestamp = function() {
  var timestamp = new Date().toISOString();
  timestamp = timestamp.replace('T', ' ');
  timestamp = timestamp.replace('Z', '');
  return timestamp;
}

var fileDebugTransport = new (winston.transports.File)({
  name: 'debug-file',
  filename: 'filelog-debug.log',
  level: 'debug',
  formatter: formatter,
  timestamp: timestamp,
});

var fileInfoTransport = new (winston.transports.File)({
  name: 'info-file',
  filename: 'filelog-info.log',
  level: 'info',
  json: false,
  prettyPrint: true,
  formatter: formatter,
  timestamp: timestamp,
});

var fileErrorTransport = new (winston.transports.File)({
  name: 'error-file',
  filename: 'filelog-error.log',
  level: 'error',
  formatter: formatter,
  timestamp: timestamp,
});

var consoleTransport = new (winston.transports.Console)({
  name: 'console',
  level: 'debug',
  json: false,
  timestamp: timestamp,
  formatter: formatter,
});

var logger = new (winston.Logger)({
  transports: [
    consoleTransport
  ]
});

var expressLogger = expressWinston.logger({
      transports: [
        consoleTransport
      ],
      meta: false,
      msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
      expressFormat: true,
      colorize: true,
    });

module.exports = {
  logger: logger,
  expressLogger: expressLogger,
};
