var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

mongoose.Promise = require('q').Promise;

var initMongo = function(log) {
  init(log);
}

var init = function(log) {
  initConnection(log);
  initModels(log);
}

var initConnection = function(log) {
  // connect to a mongo database
  var dbUrl = 'mongodb://localhost/secret-hitler'
  mongoose.connect(dbUrl, function(err){
    if(err){
      log.error(err.stack);
    } else {
      log.info('Connected to mongo at ' + dbUrl);
    }
  });
}

var initModels = function(log) {
  // require the file to initialize the schemas
  log.info('Initializing mongoose schemas');
  require('./models/models');
}

module.exports = initMongo;
