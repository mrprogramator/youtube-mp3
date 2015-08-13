var express = require('express');
var child_process = require('child_process');
var sys = require('sys');
var app = express();
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var util  = require('util');
var FfmpegCommand = require('fluent-ffmpeg');


app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', function (req, res) {
  res.sendFile('index.html', { root: path.join(__dirname, '/') });
});
app.use(express.static(__dirname + '/public'));
var server = app.listen(process.env.PORT,function () {
  console.log("listening");
});

app.post('/', function(req, res) {
  var url = req.body.name;
  console.log('uploading music');
  
  dl = child_process.spawn("./youtube-dl", ['-o', url + ".%(ext)s", '--extract-audio','--audio-format', 'mp3','-c','ytsearch:' + url]);
  
  dl.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  dl.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  dl.on('exit', function (code) {
    console.log('child process exited with code ' + code);
    var file = __dirname + '/' + url + '.mp3';
    res.download(file);
    res.on('finish', function () { 
      console.log('F I N I S H E D');
      fs.unlinkSync(file);
    });
  });
});

app.post('/video', function(req, res) {
  var url = req.body.videoUrl;
  console.log('uploading video');
  
  dl = child_process.spawn("./youtube-dl", ['-o', url + ".%(ext)s",'-c','ytsearch:' + url]);
  
  dl.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  dl.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  dl.on('exit', function (code) {
    console.log('child process exited with code ' + code);
    var file = __dirname + '/' + url + '.mp4' ;
    res.download(file);
    res.on('finish', function () { 
      console.log('F I N I S H E D');
      fs.unlinkSync(file);
    });
  });
});
