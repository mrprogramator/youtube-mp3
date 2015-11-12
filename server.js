var express = require('express');
var child_process = require('child_process');
var app = express();

var fs = require('fs');
var bodyParser = require('body-parser');
var util  = require('util');
var glob = require('glob');


// Put these statements before you define any routes.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use(express.static(__dirname + ''));

app.listen(process.env.PORT || 8080, function () {
  console.log('listening...');
});

app.post('/get-title', function(req, res) {
  console.log(req.body);
  var url = req.body.data;
  var name = "EMPTY";
  console.log('getting title...')
  var process = child_process.spawn("./youtube-dl", ['--get-title','--default-search','ytsearch',url]);
  
  process.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
    name = data.toString();
    res.send(name);
  });

  process.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });
});

app.post('/get-mp3', function(req, res) {
  console.log(req.body);
  
  var url = req.body.url;
  var name = req.body.name;
  
  var process = child_process.spawn("./youtube-dl",['--ffmpeg-location','./ffmpeg','-o',"%(title)s.%(ext)s",'--extract-audio','--audio-format','mp3','--default-search','ytsearch', url])
  
  
  process.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  process.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });
  
  process.on('exit', function (code, data) {
    console.log('process exit with code ' + code,data);
    res.send(true);
  });
})

app.post('/get-mp4', function(req, res) {
  console.log(req.body);
  
  var url = req.body.url;
  var name = req.body.name;
  
  var process = child_process.spawn("./youtube-dl",['--ffmpeg-location','./ffmpeg','-o',"%(title)s.%(ext)s",'--format','mp4','--default-search','ytsearch', url])
  
  
  process.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  process.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });
  
  process.on('exit', function (code, data) {
    console.log('process exit with code ' + code,data);
    res.send(true);
  });
})


app.post('/download', function(req, res) {
  console.log(req.body);

  var name = req.body.name;
  
  
  console.log('Buscando el archivo ' + name);
  glob(name + "*", function (err, files) {
      if(files == 0) {
        console.log('No se encuentra el archivo ' + name);
        res.send(false);
      }
      
      var file = files[0];
      res.download(file);
      
      res.on('finish', function () {
        console.log('F I N I S H E D');
        /*console.log('deleting ', file);
        fs.unlinkSync(file, function (err) {
          if (err){
            res.send('Error al borrar archivo mp3 :' + err);
            return;
          }
          console.log('successfully deleted ' + name + '.mp3');
        });*/
      });
  })
  
})
