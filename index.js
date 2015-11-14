var moment = require('moment-timezone');
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser')
var multipart = require('connect-multiparty');

app.use(multipart());
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.text());

app.get('/log', function (req, res) {
  fs.createReadStream('./logfile.log')
    .pipe(res);
});

// define the home page route
app.all('/data', function (req, res) {
  var now = moment();
  var inData = [
    'dt: ' + now.utc()
    .format(),
    'dt-local: ' + now.tz('Asia/Hong_Kong')
    .format(),
    'ip: ' + JSON.stringify(req.ip),
    'ips: ' + JSON.stringify(req.ips),
    'headers: ' + JSON.stringify(req.headers),
    'query: ' + JSON.stringify(req.query),
    'body: ' + JSON.stringify(req.body)
  ];

  fs.appendFile('./logfile.log', inData.join("\n") + "\n\n", function (err) {
    if (err) {
      res.send('ERR');
    }
  });
  res.send(inData);
});

app.all('/clean', function (req, res) {
  fs.truncate('./logfile.log', 0, function (err) {
    if (err) {
      res.send('ERR');
    }
    res.send('OK');
  });
});
app.listen(4000);
console.log('Express app started on port %d', 4000);
