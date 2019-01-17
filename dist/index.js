'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var port = 8080;

app.get('/', function (req, res) {
  return res.send('Hello World!');
});

app.listen(port, function () {
  return console.log('Example app listening on port ' + port + '!');
});