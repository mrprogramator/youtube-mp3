var express = require('express');
var child_process = require('child_process');
var sys = require('sys');
var app = express();
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var util  = require('util');
var glob = require('glob');
var ffmpeg = require('ffmpeg');

var Ffmpeg = require('fluent-ffmpeg');

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
  
  dl = child_process.spawn("./youtube-dl", ['-o', url + ".%(ext)s", '--extract-audio','-c','ytsearch:' + url]);
  
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
      
      var command = new Ffmpeg({source: file})
        .withAudioCodec('libmp3lame')
        .toFormat('mp3')
        .saveToFile(url + '.mp3');
      command.on('start', function () {
        console.log('Starting convertion to mp3');
      });
      
      command.on('progress', function(progress) {
        console.log('targetSize:',progress.targetSize);
      });
      
      command.on('error', function(err) {
        console.log('Cannot convert audio: ' + err.message);
      });
      
      command.on('end', function() {
        console.log('Processing finished successfully');
        glob(url + '.mp3', function(err, mp3s) {
          if (mp3s.length == 0){
            res.send('Cannot find mp3 file of ' + url);
            return;
          }
          
          console.log('deleting ', file);
          fs.unlinkSync(file, function (err) {
            if (err){
              res.send('Error al borrar archivo m4a :' + err);
              return;
            }
            console.log('successfully deleted ' + url + '.m4a');
          });
          
          var mp3 = mp3s[0];
          res.download(mp3);
          res.on('finish', function () {
            console.log('F I N I S H E D');
            console.log('deleting ', mp3);
            fs.unlinkSync(mp3, function (err) {
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
