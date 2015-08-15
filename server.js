var express = require('express');
var child_process = require('child_process');
var sys = require('sys');
var app = express();
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var util  = require('util');
var glob = require('glob');

app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', function (req, res) {
  res.sendFile('index.html', { root: path.join(__dirname, '/') });
});
app.use(express.static(__dirname + '/public'));
var server = app.listen(process.env.PORT || 8080,function () {
  console.log("listening");
});

app.post('/', function(req, res) {
  var url = req.body.name;
  console.log('uploading music: ' + url);
  
  dl = child_process.spawn("./youtube-dl", ['--ffmpeg-location','./ffmpeg','-o', url + ".%(ext)s", '--extract-audio','--audio-format','mp3','-c','ytsearch:' + url]);
  
  dl.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  dl.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  dl.on('exit', function (code) {
    console.log('child process exited with code ' + code);
    
    glob(url + '.*', function(err, files) {
      if (files.length == 0){
        console.log('No se encuentra el archivo');
        res.send('No se encuentra el archivo ' + url);
        return;
      }
      
      var file = files[0];
      res.download(file);
      res.on('finish', function () {
        console.log('F I N I S H E D');
        console.log('deleting ', file);
        fs.unlinkSync(file, function (err) {
          if (err){
            res.send('Error al borrar archivo mp3 :' + err);
            return;
          }
          console.log('successfully deleted ' + url + '.mp3');
        });
      });
    });
  });
});

app.post('/video', function(req, res) {
  var url = req.body.videoUrl;
  console.log('uploading video:' + url);
  
  dl = child_process.spawn("./youtube-dl", ['-o', url + ".%(ext)s",'-c','ytsearch:' + url]);
  
  dl.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  dl.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  dl.on('exit', function (code) {
    console.log('child process exited with code ' + code);
    glob(url + '.*', function(err, files) {
      if (files.length == 0){
        console.log('No se encuentra el archivo');
        res.send('No se encuentra el archivo ' + url);
        return;
      }
      
      var file = files[0];
      res.download(file);
      res.on('finish', function () {
        console.log('F I N I S H E D');
        fs.unlinkSync(file);
      });
    });
  });
});
