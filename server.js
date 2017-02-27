var express = require('express');

var app = express();

app.use(express.static(__dirname + ''));

var http = require('http').Server(app);
var io = require('socket.io')(http);

var child_process = require('child_process');
var fs = require('fs');
var glob = require('glob');

var ms = require('mediaserver');


http.listen(process.env.PORT || 8080, function(){
  console.log('listening on :', process.env.PORT || 8080);
});

io.on('connection', function(socket){
    console.log('a client is connected', socket.id);
});

app.post('/get-mp3', function (req, res){
    var videoId = req.query.videoId;
    var folderName = req.query.folderName;
    var socketId = req.query.socketId;
    var currentClient = io.sockets.connected[socketId];
    
    res.send(true);

    fs.mkdir(folderName, function () {
        var process = child_process.spawn('./youtube-dl',
        ['--ffmpeg-location','./ffmpeg','-o',
        folderName + "/%(title)s.%(ext)s",
        '--no-playlist','--extract-audio','--audio-format','mp3',
        '--default-search','ytsearch', videoId]);

        process.stdout.on('data', function (data) {
            console.log(data.toString());
            if (currentClient){
                currentClient.emit('data', data.toString());
            }
        });

        process.on('exit', function (code, data) {
            if (currentClient){
                currentClient.emit('finish');
            }
        });
    })
})

app.post('/get-mp4', function (req, res){
    var videoId = req.query.videoId;
    var folderName = req.query.folderName;
    var socketId = req.query.socketId;
    var currentClient = io.sockets.connected[socketId];
    
    res.send(true);

    fs.mkdir(folderName, function () {
        var process = child_process.spawn("./youtube-dl",
            ['--ffmpeg-location','./ffmpeg','-o',
            folderName + "/%(title)s.%(ext)s",'--format',
            'mp4','--no-playlist','--default-search','ytsearch', videoId]);

        process.stdout.on('data', function (data) {
            if (currentClient){
                currentClient.emit('data', data.toString());
            }
        });

        process.on('exit', function (code, data) {
            if (currentClient){
                currentClient.emit('finish');
            }
        });
    })
})

app.get('/get-media', function (req, res){
    var folderName = req.query.folderName;

    glob(folderName + "/*", function (err, files) {
        if(files == 0) {
            res.send(false);
        }

        var file = files[0];
        var fileExt = file.split('.')[1];

        if(fileExt == 'mp3'){
            ms.pipe(req, res,file,'audio/mp3');
        }
        else if(fileExt == 'mp4'){
            ms.pipe(req, res, file, 'video/mpeg');
        }
        else{
            ms.pipe(req, res, file, 'audio/webm');
        }
    })
})

app.post('/download', function(req, res) {
    var folderName = req.query.folderName;
    glob(folderName + "/*", function (err, files) {
        if(files == 0) {
            res.send(false);
        }

        var file = files[0];

        res.download(file);

        res.on('finish', function () {
            var proccess = child_process.spawn('rm',['-r',folderName]);
        });
    })
})

app.get('/upgrade', function (req, res) {
    var process = child_process.spawn("./youtube-dl",['-U']);

    var logProccess = "";
    process.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
        logProccess += data.toString();
        
    });

    process.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });
    
    process.on('exit', function () {
        res.send(logProccess);
    })
});

app.get('/version', function (req, res) {
    var process = child_process.spawn("./youtube-dl",['--version']);

    var logProccess = "";
    process.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
        logProccess += data.toString();
        
    });

    process.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });
    
    process.on('exit', function () {
        res.send(logProccess);
    })
});