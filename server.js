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

app.get('/error', function (req, res) {
  res.sendFile('error.html', { root: path.join(__dirname, '/') });
});


app.use(express.static(__dirname + '/public'));
var server = app.listen(process.env.PORT || 8080,function () {
  console.log("listening");
});

app.post('/music', function(req, res) {
  var url = req.body.name;
  var name = url;
  console.log('getting title...');
  dl = child_process.spawn("./youtube-dl", ['--get-title','-o',"%(title)s.%(ext)s",'--extract-audio','--audio-format','mp3','ytsearch:' + url]);
  var nameCatched = false;
  dl.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
    
    if (nameCatched){
      return;
    }
    
    name = data.toString();
    console.log('name:',name);
    
    fs.appendFile('list.txt',name,function (err) {
      if (err != null) {
        console.log('ERROR on writing list.txt:',err);
      }
    });
    
    nameCatched = true;
  });

  dl.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  dl.on('exit', function (code) {
    console.log('child process exited with code ' + code);
    var xx = child_process.spawn("./youtube-dl", ['--ffmpeg-location','./ffmpeg','-o',"%(title)s.%(ext)s",'--extract-audio','--audio-format','mp3','--max-downloads','1','-c','ytsearch:' + url]);
    xx.stdout.on('data', function (data) {
      console.log('stdout: ' + data);
      console.log('name:',name);
    });

    xx.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });
    xx.on('exit', function (code) {
      name = name.substring(0,name.length - 1);
      var str = name.toString();
      glob(str + ".mp3", function(err, files) {
        if (files.length == 0){
          console.log('No se encontro por nombre, forzando a mp3');
          glob('*.mp3',function(err, subfiles){
              if (subfiles.length == 0){
                  console.log('No se encuentra el archivo ' + name);
                  res.send('No se encuentra el archivo ' + name);
                  return;
              }
              var file = subfiles[0];
              res.download(file);
              res.on('finish', function () {
                console.log('F I N I S H E D');
                console.log('deleting ', file);
                /*fs.unlinkSync(null, function (err) {
                  if (err){
                    res.send('Error al borrar archivo mp3 :' + err);
                    return;
                  }
                  console.log('successfully deleted ' + name + '.mp3');
                });*/
              });
          });
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
            console.log('successfully deleted ' + name + '.mp3');
          });
        });
      });
    });
    
  });
});

app.post('/video', function(req, res) {
  var url = req.body.videoUrl;
  var name = url;
  console.log('getting title...');
  dl = child_process.spawn("./youtube-dl", ['--get-title','ytsearch:' + url]);
  var nameCatched = false;
  dl.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
    
    if (nameCatched){
      return;
    }
    
    name = String(data);
    console.log('name:',name);
    
    fs.appendFile('list.txt',name,function (err) {
      if (err != null) {
        console.log('ERROR on writing list.txt:',err);
      }
    });
    
    nameCatched = true;
  });

  dl.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  dl.on('exit', function (code) {
    console.log('child process exited with code ' + code);
    var xx = child_process.spawn("./youtube-dl", ['--ffmpeg-location','./ffmpeg','-o',"%(title)s.%(ext)s",'-c','ytsearch:' + url]);
    xx.stdout.on('data', function (data) {
      console.log('stdout: ' + data);
      console.log('name:',name);
    });

    xx.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });
    xx.on('exit', function (code) {
      name = name.substring(0,name.length - 1);
      glob(name + ".*", function(err, files) {
        if (files.length == 0){
          console.log('No se encontro por nombre, forzando a mp4');
          glob('*.mp4',function(err, subfiles){
              if (subfiles.length == 0){
                  console.log('No se encuentra el archivo ' + name);
                  console.log('No se encontro por nombre, forzando a webm');
                  glob('*.webm',function(err, subfiles2){
                      if (subfiles2.length == 0){
                          console.log('No se encuentra el archivo ' + name);
                          res.send('No se encuentra el archivo ' + name);
                          return;
                      }
                      var file = subfiles2[0];
                      res.download(file);
                      res.on('finish', function () {
                        console.log('F I N I S H E D');
                        console.log('deleting ', file);
                        fs.unlinkSync(file, function (err) {
                          if (err){
                            res.send('Error al borrar archivo :' + err);
                            return;
                          }
                          console.log('successfully deleted ' + name);
                        });
                      });
                  });
                  return;
                  res.send('No se encuentra el archivo ' + name);
                  return;
              }
              var file = subfiles[0];
              res.download(file);
              res.on('finish', function () {
                console.log('F I N I S H E D');
                console.log('deleting ', file);
                fs.unlinkSync(file, function (err) {
                  if (err){
                    res.send('Error al borrar archivo :' + err);
                    return;
                  }
                  console.log('successfully deleted ' + name);
                });
              });
          });
          return;
        }
        
        var file = files[0];
        res.download(file);
        res.on('finish', function () {
          console.log('F I N I S H E D');
          console.log('deleting ', file);
          fs.unlinkSync(file, function (err) {
            if (err){
              res.send('Error al borrar archivo de video :' + err);
              return;
            }
            console.log('successfully deleted ' + name);
          });
        });
      });
    });
    
  });
});
