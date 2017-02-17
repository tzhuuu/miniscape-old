var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
var filePath = path.join(__dirname, '..', 'public/html/index.html');
router.get('/', function(req, res, next) {
  return res.sendFile(filePath);
});

module.exports = router;
