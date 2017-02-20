var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// Definition of schemas
var Login = new Schema({
  username: { type: String, minLength: 4, maxLength: 20 },
  password: { type: String, minLength: 4, maxLength: 50 },
  lastLogin: { type: Number, default: new Date().now },
  playerId: { type: Schema.Types.ObjectId },
  token: { type: String, default: '' }
});

var Player = new Schema({
  id: { type: Schema.Types.ObjectId },
  created: { type: Number, default: new Date().now },
  __v: { type: Number, select: false}
});

var Item = new Schema({
  id: { type: Schema.Types.ObjectId },
});

mongoose.model('Login', Login);
mongoose.model('Player', Player);
mongoose.model('Item', Item);
